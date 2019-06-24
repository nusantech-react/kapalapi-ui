import Device from 'config/device'

function applyScale(size) {
  return Math.round(size * Device.scale)
}

export default applyScale
