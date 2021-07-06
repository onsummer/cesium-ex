import { Cartesian2, Cartesian3, Cartographic, Math as CesiumMath } from 'cesium'

const { DEGREES_PER_RADIAN } = CesiumMath

/**
 * @typedef {[number, number, number]} LonLatLike -
 */

/**
 *
 * @param {Cartesian3 | Cartographic} value
 * @returns {LonLatLike}
 */
export const toLonLatArray = (value) => {
  if (value instanceof Cartesian3) {
    return [
      Cartographic.fromCartesian(value).longitude * DEGREES_PER_RADIAN,
      Cartographic.fromCartesian(value).latitude * DEGREES_PER_RADIAN,
      Cartographic.fromCartesian(value).height
    ]
  }
  if (value instanceof Cartographic) {
    return [value.longitude * DEGREES_PER_RADIAN, value.latitude * DEGREES_PER_RADIAN, value.height]
  }

  return [0, 0, 0]
}

/**
 *
 * @param {[number, number] | Cartesian2} position
 */
export const windowPositionToLonLat = (position) => {
  if (Array.isArray(position)) {
  }
}
