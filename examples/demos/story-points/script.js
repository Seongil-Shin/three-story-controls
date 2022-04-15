import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  GridHelper,
  ConeGeometry,
  MeshPhongMaterial,
  Mesh,
  Vector3,
  HemisphereLight,
  Quaternion,
} from 'three'
import { CameraRig, StoryPointsControls, ThreeDOFControls } from 'three-story-controls'
import cameraData from './camera-data.json'

const canvasParent = document.querySelector('.canvas-parent')
const nextBtn = document.querySelector('.next')
const prevBtn = document.querySelector('.prev')

const scene = new Scene()
const camera = new PerspectiveCamera(45, canvasParent.clientWidth / canvasParent.clientHeight, 0.1, 10000)
const renderer = new WebGLRenderer()
renderer.setSize(canvasParent.clientWidth, canvasParent.clientHeight)
canvasParent.appendChild(renderer.domElement)

const light = new HemisphereLight(0xffffbb, 0x080820, 1)
scene.add(light)

const grid = new GridHelper(100, 50)
grid.position.set(0, -5, 0)
scene.add(grid)

const cones = [
  {
    meshPosition: new Vector3(0, 0, -30),
    color: 0xff0000,
  },
  {
    meshPosition: new Vector3(20, 0, -45),
    color: 0xffff00,
  },
  {
    meshPosition: new Vector3(45, 0, 0),
    color: 0xff00ff,
  },
  {
    meshPosition: new Vector3(30, 0, 20),
    color: 0x00ffff,
  },
  {
    meshPosition: new Vector3(-10, 0, 45),
    color: 0x00ff00,
  },
  {
    meshPosition: new Vector3(-40, 0, 20),
    color: 0x0000ff,
  },
]

const coneGeo = new ConeGeometry(3, 10, 4)
cones.forEach((item) => {
  const mesh = new Mesh(coneGeo, new MeshPhongMaterial({ color: item.color }))
  mesh.position.copy(item.meshPosition)
  scene.add(mesh)
})
const pois = cameraData.pois.map((poi) => ({
  position: new Vector3(...poi.position),
  quaternion: new Quaternion(...poi.quaternion),
  duration: poi.duration,
  ease: poi.ease,
}))
const rig = new CameraRig(camera, scene)
const controls = new StoryPointsControls(rig, pois)

//
controls.enable()
controls.goToPOI(0)
const controls3dof = new ThreeDOFControls(rig)
controls3dof.enable()

//
nextBtn.addEventListener('click', () => controls.nextPOI())
prevBtn.addEventListener('click', () => controls.prevPOI())

function render(t) {
  window.requestAnimationFrame(render)
  controls.update(t)
  controls3dof.update(t)
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

render()
