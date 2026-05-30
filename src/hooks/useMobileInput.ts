// Shared mutable object — module-level so both MobileControls and
// CharacterController can read/write without React state overhead
export const mobileInput = {
  dx:   0,      // joystick X: -1 (left)   → +1 (right)
  dy:   0,      // joystick Y: -1 (forward) → +1 (backward)
  jump: false,
}
