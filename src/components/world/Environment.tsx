import { Stars } from '@react-three/drei'

export function SpaceEnvironment() {
  return (
    <>
      <Stars radius={300} depth={80} count={5000} factor={3} saturation={0} fade speed={0.3} />

      {/* Strong ambient so nothing is pitch-black */}
      <ambientLight intensity={1.8} color="#c8deff" />

      {/* Main overhead white fill — simulates functional ceiling lights */}
      <pointLight position={[0, 7, 0]}    intensity={200} color="#ffffff" distance={35} decay={2} />

      {/* Four ceiling-mounted work lights */}
      <pointLight position={[8, 6, 8]}    intensity={80}  color="#ddeeff" distance={20} decay={2} />
      <pointLight position={[-8, 6, 8]}   intensity={80}  color="#ddeeff" distance={20} decay={2} />
      <pointLight position={[8, 6, -8]}   intensity={80}  color="#ddeeff" distance={20} decay={2} />
      <pointLight position={[-8, 6, -8]}  intensity={80}  color="#ddeeff" distance={20} decay={2} />

      {/* Cyan strip accent — from wall panels */}
      <pointLight position={[0, 2, -13]}  intensity={60}  color="#00e5ff" distance={18} decay={2} />
      <pointLight position={[0, 2,  13]}  intensity={60}  color="#00e5ff" distance={18} decay={2} />
      <pointLight position={[13, 2, 0]}   intensity={60}  color="#00bfff" distance={18} decay={2} />
      <pointLight position={[-13, 2, 0]}  intensity={60}  color="#00bfff" distance={18} decay={2} />

      {/* Warm floor uplighter so the grid reads */}
      <pointLight position={[0, 0.3, 0]}  intensity={40}  color="#2244aa" distance={20} decay={2} />
    </>
  )
}
