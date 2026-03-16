import * as THREE from 'three'
import { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { FaMapMarkerAlt } from 'react-icons/fa'

function EarthSphere(props) {
  const meshRef = useRef()
  
  // Rotate the earth slowly
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })
  
  return (
    <group {...props}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          roughness={0.3}
          metalness={0.1}
        />
        
        {/* Add some earthquake markers */}
        <Marker position={[0, 2.1, 0]}>
          <FaMapMarkerAlt style={{ color: '#ef4444', fontSize: '16px' }} />
        </Marker>
        
        <Marker position={[1.5, 1.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <FaMapMarkerAlt style={{ color: '#f59e0b', fontSize: '14px' }} />
        </Marker>
        
        <Marker position={[-1.2, -1.2, 1.2]} rotation={[0, -Math.PI / 3, 0]}>
          <FaMapMarkerAlt style={{ color: '#10b981', fontSize: '12px' }} />
        </Marker>
      </mesh>
    </group>
  )
}

// Let's make the marker into a component so that we can abstract some shared logic
function Marker({ children, ...props }) {
  const ref = useRef()
  // This holds the local occluded state
  const [isOccluded, setOccluded] = useState()
  const [isInRange, setInRange] = useState()
  const isVisible = isInRange && !isOccluded
  // Test distance
  const vec = new THREE.Vector3()
  useFrame((state) => {
    const range = state.camera.position.distanceTo(ref.current.getWorldPosition(vec)) <= 10
    if (range !== isInRange) setInRange(range)
  })
  
  return (
    <group ref={ref}>
      <Html
        // 3D-transform contents
        transform
        // Hide contents "behind" other meshes
        occlude
        // Tells us when contents are occluded (or not)
        onOcclude={setOccluded}
        // We just interpolate the visible state into css opacity and transforms
        style={{ 
          transition: 'all 0.2s', 
          opacity: isVisible ? 1 : 0, 
          transform: `scale(${isVisible ? 1 : 0.25})` 
        }}
        {...props}
      >
        {children}
      </Html>
    </group>
  )
}

export default function Globe3D() {
  return (
    <Canvas camera={{ position: [6, 2, 6], fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <EarthSphere position={[0, 0, 0]} />
        <Environment preset="city" />
        <ContactShadows frames={1} scale={8} position={[0, -2.5, 0]} far={2} blur={5} opacity={0.3} color="#204080" />
        <OrbitControls enableZoom={true} enablePan={false} />
      </Suspense>
    </Canvas>
  )
}