'use client'

/**
 * Physics-driven hanging badge: a card clipped to a cord that swings under gravity and can be
 * dragged. Adapted from React Bits' "Lanyard" example (MIT + Commons Clause).
 *
 * Keep as a single component (don't split, don't duplicate `useGLTF`) — an earlier split
 * crashed WebGL. Two required fixes:
 * 1. `colliders: false` on every RigidBody, or Rapier's auto-collider fights our manual ones.
 * 2. No `enabledRotations` — counter-rotate angular velocity instead (see `setAngvel` below).
 */

// React Imports
import { useEffect, useMemo, useRef, useState } from 'react'

// Third-party Imports
import * as THREE from 'three'
import { useTheme } from 'next-themes'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import type { RapierRigidBody, RigidBodyProps } from '@react-three/rapier'

// Local copy decoded from the supplied registry's base64 model.

const CARD_MODEL_URL = '/models/lanyard.glb'

// Rope tube radius (a real cylinder, not a flat ribbon).
const ROPE_RADIUS = 0.1

// Rope cross-section smoothness.
const ROPE_RADIAL_SEGMENTS = 8

// Fraction of rope length that tapers to a point instead of a flat cut.
const ROPE_TAPER_FRACTION = 0.06

// Card-local y where the rope ties on, shared with the per-frame curve endpoint below.
const CARD_ROPE_ANCHOR_Y = 1.1

// Extends the rendered rope past the joint's physical slack to close the visual gap.
const ROPE_TOP_EXTENSION = -0.5

// Pin hardware cutout, rendered as a camera-facing plane.
const PIN_IMAGE_URL = '/images/profile/lanyard-pin.png'

// Pin image is 1024×1536 with uneven padding — only the bottom pad fraction is needed.
const PIN_IMAGE_ASPECT = 1024 / 1536
const PIN_IMAGE_BOTTOM_PAD_FRACTION = (1536 - 1432) / 1536

// World y of the card's real top edge, where the pin's hook tip should land.
const CARD_TOP_EDGE_Y = 0.93

// Plane keeps the image's raw aspect ratio.
const PIN_PLANE_HEIGHT = 1.4
const PIN_PLANE_WIDTH = PIN_PLANE_HEIGHT * PIN_IMAGE_ASPECT

// Derived so the pin's hook tip lands exactly at CARD_TOP_EDGE_Y at any PIN_PLANE_HEIGHT.
const PIN_PLANE_Y = CARD_TOP_EDGE_Y + PIN_PLANE_HEIGHT * -PIN_IMAGE_BOTTOM_PAD_FRACTION
const PIN_PLANE_X = 0

// Past ROPE_RADIUS so the rope's near-camera bulge doesn't cover the pin.
const PIN_PLANE_Z = ROPE_RADIUS + 0.06

// Real gap in card.glb's mesh (grommet hole), in the card's local coordinate frame.
const HOLE_PATCH_LOCAL_X = 0
const HOLE_PATCH_LOCAL_Y = 0.942
const HOLE_PATCH_LOCAL_SIZE = 0.055

// UV region of `cardMap` sampled for the hole patch.
const HOLE_PATCH_UV_OFFSET = [0.2308, 0.0443] as const
const HOLE_PATCH_UV_REPEAT = [0.0375, 0.0405] as const

// Front/back face UVs on the badge's texture atlas.
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 }
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.755 }

// Accent stripe height as a fraction of face height.
const ACCENT_STRIPE_HEIGHT_RATIO = 0.03

type CardGltf = {
  nodes: { card: THREE.Mesh }
  materials: { base: THREE.MeshStandardMaterial }
}

type LanyardRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 }

const getLerped = (body: LanyardRigidBody) => {
  if (!body.lerped) {
    body.lerped = new THREE.Vector3().copy(body.translation())
  }

  return body.lerped
}

// TubeGeometry with a per-ring radius that tapers to 0 at t=0, instead of a flat cut.
const buildTaperedTubeGeometry = (
  curve: THREE.CatmullRomCurve3,
  tubularSegments: number,
  radius: number,
  radialSegments: number,
  taperFraction: number
) => {
  const frames = curve.computeFrenetFrames(tubularSegments, false)
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const vertex = new THREE.Vector3()
  const normal = new THREE.Vector3()

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments
    const point = curve.getPointAt(t)
    const N = frames.normals[i]
    const B = frames.binormals[i]

    // t=0 is the pin/card end — taper happens there, not at the fixed top anchor.
    const ringRadius = t < taperFraction ? radius * (t / taperFraction) : radius

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2
      const sin = Math.sin(angle)
      const cos = -Math.cos(angle)

      normal.x = cos * N.x + sin * B.x
      normal.y = cos * N.y + sin * B.y
      normal.z = cos * N.z + sin * B.z
      normal.normalize()
      normals.push(normal.x, normal.y, normal.z)

      vertex.x = point.x + ringRadius * normal.x
      vertex.y = point.y + ringRadius * normal.y
      vertex.z = point.z + ringRadius * normal.z
      positions.push(vertex.x, vertex.y, vertex.z)

      uvs.push(t, j / radialSegments)
    }
  }

  for (let j = 1; j <= tubularSegments; j++) {
    for (let i = 1; i <= radialSegments; i++) {
      const a = (radialSegments + 1) * (j - 1) + (i - 1)
      const b = (radialSegments + 1) * j + (i - 1)
      const c = (radialSegments + 1) * j + i
      const d = (radialSegments + 1) * (j - 1) + i

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

  return geometry
}

type BandProps = {
  frontImage: string
  isMobile: boolean
  accentColor: string
}

const Band = ({ frontImage, isMobile, accentColor }: BandProps) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const rope = useRef<THREE.Mesh>(null!)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<LanyardRigidBody>(null!)
  const j2 = useRef<LanyardRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const cardQuat = new THREE.Quaternion()

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,

    // Fix 1 — see file header.
    colliders: false,

    // Bounciness knob, safe to tune freely.
    angularDamping: 1.5,
    linearDamping: 1.5
  }

  const { nodes, materials } = useGLTF(CARD_MODEL_URL) as unknown as CardGltf
  const frontTexture = useTexture(frontImage)

  // Camera-facing plane, not procedural geometry — reads the same from this angle.
  const pinTexture = useTexture(PIN_IMAGE_URL)

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture
    const baseImage = baseMap.image as HTMLImageElement
    const width = baseImage.width
    const height = baseImage.height

    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (!ctx) return baseMap

    ctx.drawImage(baseImage, 0, 0, width, height)

    const image = frontTexture.image as HTMLImageElement

    for (const uvRect of [FRONT_UV_RECT, BACK_UV_RECT]) {
      const rx = uvRect.x * width
      const ry = uvRect.y * height
      const rw = uvRect.w * width
      const rh = uvRect.h * height
      const scale = Math.max(rw / image.width, rh / image.height)
      const dw = image.width * scale
      const dh = image.height * scale
      const dx = rx + (rw - dw) / 2
      const dy = ry + (rh - dh) / 2

      ctx.save()
      ctx.beginPath()
      ctx.rect(rx, ry, rw, rh)
      ctx.clip()
      ctx.drawImage(image, dx, dy, dw, dh)

      // Keep the physical card's printed green stripe stable across page themes.
      ctx.fillStyle = accentColor
      ctx.fillRect(rx, ry, rw, rh * ACCENT_STRIPE_HEIGHT_RATIO)
      ctx.restore()
    }

    const composite = new THREE.CanvasTexture(canvas)

    composite.colorSpace = THREE.SRGBColorSpace
    composite.flipY = baseMap.flipY
    composite.anisotropy = 16
    composite.needsUpdate = true

    return composite
  }, [frontTexture, materials.base.map, accentColor])

  // Patches a real gap in card.glb's mesh with the matching region of cardMap.
  const holePatchTexture = useMemo(() => {
    const texture = cardMap.clone()

    texture.offset.set(...HOLE_PATCH_UV_OFFSET)
    texture.repeat.set(...HOLE_PATCH_UV_REPEAT)
    texture.needsUpdate = true

    return texture
  }, [cardMap])

  useEffect(() => () => { cardMap.dispose(); holePatchTexture.dispose() }, [cardMap, holePatchTexture])

  const [curve] = useState(() => {
    const rope = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ])

    rope.curveType = 'chordal'

    return rope
  })

  const [dragged, drag] = useState<THREE.Vector3 | false>(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.85])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.85])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.85])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_ROPE_ANCHOR_Y, 0]
  ])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }

    if (fixed.current) {
      ;[j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current)
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())))

        lerped.lerp(ref.current.translation(), delta * 50 * clampedDistance)
      })

      // Keeps the rope glued to the pin at any card orientation, not just at rest.
      const cardPos = card.current.translation()
      const cardRot = card.current.rotation()

      cardQuat.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w)
      curve.points[0]
        .set(0, CARD_ROPE_ANCHOR_Y + ROPE_TOP_EXTENSION, 0)
        .applyQuaternion(cardQuat)
        .add(vec.set(cardPos.x, cardPos.y, cardPos.z))
      curve.points[1].copy(getLerped(j2.current))
      curve.points[2].copy(getLerped(j1.current))
      curve.points[3].copy(fixed.current.translation())

      // Rebuild + swap each frame to follow the curve; dispose the old geometry.
      const oldRopeGeometry = rope.current.geometry

      rope.current.geometry = buildTaperedTubeGeometry(
        curve,
        isMobile ? 12 : 24,
        ROPE_RADIUS,
        ROPE_RADIAL_SEGMENTS,
        ROPE_TAPER_FRACTION
      )
      oldRopeGeometry.dispose()

      // Fix 2 — see file header.
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation() as unknown as THREE.Vector3)
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
    }
  })

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type='fixed' />
        <RigidBody position={[0.425, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.85, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.275, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.7, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[1.42, 2.0, 0.018]} />
          <group
            scale={4}
            position={[0, -3.16, -0.09]}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).releasePointerCapture(e.pointerId)
              drag(false)

            }}
            onPointerCancel={() => drag(false)}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())))


            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshBasicMaterial map={cardMap} toneMapped={false} />
            </mesh>

            {/* Patches the real gap in card.glb's mesh — see HOLE_PATCH_* above. */}
            <mesh position={[HOLE_PATCH_LOCAL_X, HOLE_PATCH_LOCAL_Y, 0.006]}>
              <planeGeometry args={[HOLE_PATCH_LOCAL_SIZE, HOLE_PATCH_LOCAL_SIZE]} />
              <meshBasicMaterial map={holePatchTexture} toneMapped={false} />
            </mesh>
          </group>

          {/* Pin hardware plane — see PIN_IMAGE_URL/PIN_PLANE_* above. */}
          <mesh position={[PIN_PLANE_X, PIN_PLANE_Y, PIN_PLANE_Z]}>
            <planeGeometry args={[PIN_PLANE_WIDTH, PIN_PLANE_HEIGHT]} />
            <meshBasicMaterial map={pinTexture} transparent alphaTest={0.1} toneMapped={false} />
          </mesh>
        </RigidBody>
      </group>

      {/* Geometry is swapped imperatively each frame — no JSX <tubeGeometry> child, and
          frustumCulled is off since the bounding sphere updates lazily. */}
      <mesh ref={rope} frustumCulled={false}>
        <meshStandardMaterial color={isDark ? '#d4d4d8' : '#262626'} roughness={0.55} metalness={0.15} />
      </mesh>
    </>
  )
}

const StudioLighting = () => (
  <Environment blur={0.75}>
    <Lightformer
      intensity={2}
      color='white'
      position={[0, -1, 5]}
      rotation={[0, 0, Math.PI / 3]}
      scale={[100, 0.1, 1]}
    />
    <Lightformer
      intensity={3}
      color='white'
      position={[-1, -1, 1]}
      rotation={[0, 0, Math.PI / 3]}
      scale={[100, 0.1, 1]}
    />
    <Lightformer
      intensity={3}
      color='white'
      position={[1, 1, 1]}
      rotation={[0, 0, Math.PI / 3]}
      scale={[100, 0.1, 1]}
    />
    <Lightformer
      intensity={10}
      color='white'
      position={[-10, 0, 14]}
      rotation={[0, Math.PI / 2, Math.PI / 3]}
      scale={[100, 10, 1]}
    />
  </Environment>
)

type IdCardProps = { frontImage: string; active: boolean; onReady: () => void; onFailure: () => void }

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => { onReady() }, [onReady])
  return null
}

export default function IdCard({ frontImage, active, onReady, onFailure }: IdCardProps) {
  return <Canvas
    camera={{ position: [0, 0, 20], fov: 20 }}
    dpr={[1, 1.5]}
    frameloop={active ? 'always' : 'never'}
    gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
    onCreated={({ gl }) => {
      gl.setClearColor(new THREE.Color(0x000000), 0)
      gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true })
    }}
  >
    <ambientLight intensity={Math.PI} />
    <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!active}>
      <Band frontImage={frontImage} isMobile={false} accentColor='#275d49' />
      <Ready onReady={onReady} />
    </Physics>
    <StudioLighting />
  </Canvas>
}
