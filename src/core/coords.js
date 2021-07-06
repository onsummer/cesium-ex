import {
  Cartesian2,
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  Matrix4,
  Scene,
  SceneTransforms,
  Transforms,
  Ellipsoid
} from 'cesium'

const { DEGREES_PER_RADIAN } = CesiumMath

/**
 * @description CGCS2000 椭球体
 */
export const CGCS2000_ELLIPSOID = Object.freeze(new Ellipsoid(6378137, 6378137, 6356752.31414))

/**
 * @typedef {[number, number, number]} LonLatLike 经纬高，其中经纬度为角度值
 */

/**
 * 笛卡尔世界坐标（`Cartesian3`）或弧度地理坐标（`Cartographic`）转经纬度数组
 * @param {Cartesian3 | Cartographic} value
 * @returns {LonLatLike} 经纬高，经纬度为角度值，例如 `[112.42, 33.52, 1500]`
 */
export const toLonLatArray = (value) => {
  if (value instanceof Cartesian3) {
    return [
      Cartographic.fromCartesian(value).longitude * DEGREES_PER_RADIAN,
      Cartographic.fromCartesian(value).latitude * DEGREES_PER_RADIAN,
      Cartographic.fromCartesian(value).height
    ]
  } else {
    return [value.longitude * DEGREES_PER_RADIAN, value.latitude * DEGREES_PER_RADIAN, value.height]
  }
}

/**
 * 屏幕坐标转经纬度数组
 * @param {[number, number] | Cartesian2} position 屏幕坐标，例如 `[831, 104]` 或 `Cartesian2 { x: 831, y: 104 }`
 * @param {Scene} scene Cesium 场景对象
 *
 * @returns {LonLatLike | undefined} 返回经纬度（角度）数组，例如 `[112.72, 24.81]`。当未落在场景中时，有可能会返回 undefined
 */
export const windowPositionToLonLat = (position, scene) => {
  let cartesian3
  if (Array.isArray(position)) {
    if (scene.globe.depthTestAgainstTerrain === true) {
      cartesian3 = scene.pickPosition(Cartesian2.fromElements(...position))
    }
    cartesian3 = scene.globe.pick(
      scene.camera.getPickRay(Cartesian2.fromElements(...position)),
      scene
    )
  } else {
    cartesian3 = scene.globe.pick(scene.camera.getPickRay(position), scene)
  }

  return cartesian3 === undefined ? undefined : toLonLatArray(cartesian3)
}

/**
 * 获取一个转换矩阵，该矩阵表示某处（经纬度）以正北为 y 轴，正东为 x 轴，垂直朝上为 z 轴的局部坐标系，到世界坐标系的转换关系。
 * @param {[number, number]} position
 *
 * @returns {Matrix4}
 */
export const getLocalTransformMatrix = (position) => {
  const cartesian3 = Cartesian3.fromDegrees(...position)
  return Transforms.eastNorthUpToFixedFrame(cartesian3)
}

/**
 * 世界坐标 {@link Cartesian3} / 地理弧度坐标 {@link Cartographic} / 经纬度坐标 {@link LonLatLike} 转屏幕坐标
 * @param {Cartesian3 | Cartographic | LonLatLike} position
 * @param {Scene} scene
 *
 * @example
 * ``` js
 * const windowCoords = toWindowPosition([112.53, 23.78, 0], viewer.scene)
 * ```
 * @returns {[number, number] | undefined}
 */
export const toWindowPosition = (position, scene) => {
  let cartesian2
  if (position instanceof Cartesian3) {
    cartesian2 = SceneTransforms.wgs84ToWindowCoordinates(scene, position)
  } else if (position instanceof Cartographic) {
    cartesian2 = SceneTransforms.wgs84ToWindowCoordinates(scene, Cartographic.toCartesian(position))
  } else {
    cartesian2 = SceneTransforms.wgs84ToWindowCoordinates(
      scene,
      Cartesian3.fromDegrees(...position)
    )
  }
  return cartesian2 === undefined ? undefined : [cartesian2.x, cartesian2.y]
}
