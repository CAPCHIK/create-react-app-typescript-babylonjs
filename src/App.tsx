import React, { useCallback, Component } from 'react';
import "@babylonjs/core/Physics/physicsEngineComponent"  // side-effect adds scene.enablePhysics function
import { Vector3, PhysicsImpostor, Mesh, Nullable, Color3, FresnelParameters, Texture } from '@babylonjs/core';
import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins'
import { Scene, Engine } from 'react-babylonjs';
import './App.css';
import * as CANNON from 'cannon';
window.CANNON = CANNON;

const gravityVector = new Vector3(0, -9.81, 0);
let sphere: Nullable<Mesh> = null;

const onButtonClicked = () => {
  if (sphere !== null) {
    sphere.physicsImpostor!.applyImpulse(Vector3.Up().scale(10), sphere.getAbsolutePosition())
  }
}

class App extends Component<{}, { textBlockIds: Array<string>, scenes: Array<{ show: boolean, id: string, title: string, position: number }> }> {
  private sphereRef: any;
  private lastId = -5;
  constructor(props: any) {
    super(props)

    this.sphereRef = (node: any) => {
      sphere = node.hostInstance;
    };

    this.state = {
      scenes: [
        {
          title: `title ${this.lastId}`,
          position: this.lastId,
          id: (this.lastId++).toString(),
          show: true
        },
        {
          title: `title ${this.lastId}`,
          position: this.lastId,
          id: (this.lastId++).toString(),
          show: true
        },
        {
          title: `title ${this.lastId}`,
          position: this.lastId,
          id: (this.lastId++).toString(),
          show: true
        }
      ],
      textBlockIds: [
        this.lastId.toString(),
        (this.lastId + 1).toString(),
        (this.lastId + 2).toString(),
        (this.lastId + 3).toString(),
        (this.lastId + 4).toString(),
        (this.lastId + 5).toString(),
        (this.lastId + 6).toString(),
        (this.lastId + 7).toString(),
        (this.lastId + 8).toString(),
      ]
    }
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd() {
    this.setState(state => ({
      ...state,
      scenes: [
        ...state.scenes,
        {
          title: `title ${this.lastId}`,
          position: this.lastId,
          id: (this.lastId++).toString(),
          show: true
        }
      ],
      textBlockIds: state.textBlockIds.filter(id => id != (this.lastId - 1).toString())
    }));
  }

  public render() {
    const { sphereRef, state } = this;
    return (
      <div className="App" >
        <div>
          <button onClick={this.handleAdd}>Add</button>
        </div>
        {
          state.scenes.map(s =>
            <div key={s.id}>
              <button >{s.title}</button>
            </div>
          )
        }
        <Engine antialias={true} adaptToDeviceRatio={true} canvasId="sample-canvas">
          <Scene enablePhysics={[gravityVector, new CannonJSPlugin()]}>
            <arcRotateCamera name="arc" target={new Vector3(0, 1, 0)}
              alpha={-Math.PI / 2} beta={(0.5 + (Math.PI / 4))}
              radius={4} minZ={0.001} wheelPrecision={50}
              lowerRadiusLimit={8} upperRadiusLimit={20} upperBetaLimit={Math.PI / 2} />
            <hemisphericLight name='hemi' direction={new Vector3(0, -1, 0)} intensity={0.8} />
            <directionalLight name="shadow-light" setDirectionToTarget={[Vector3.Zero()]} direction={Vector3.Zero()} position={new Vector3(-40, 30, -40)}
              intensity={0.4} shadowMinZ={1} shadowMaxZ={2500}>
              <shadowGenerator mapSize={1024} useBlurExponentialShadowMap={true} blurKernel={32} darkness={0.8}
                shadowCasters={["sphere1", "dialog"]} forceBackFacesOnly={true} depthScale={100} />
            </directionalLight>
            {
              state.scenes.map(s => (
                <sphere
                  key={s.id}
                  name={s.title} diameter={1} segments={16} position={new Vector3(s.position, 0, 0)}>
                </sphere>
              ))
            }
            <ground name="ground1" width={10} height={10} subdivisions={2} receiveShadows={true}>
              <physicsImpostor type={PhysicsImpostor.BoxImpostor} _options={{ mass: 0, restitution: 0.9 }} />
            </ground>
            <adtFullscreenUi name="fullScreenUI">
              {
                state.scenes.concat(state.textBlockIds.map(id => ({ id, position: +id, title: "some_bad_title", show: false}))).map(s => (
                  <textBlock key={s.id} top={s.position * 20} text={s.title} isVisible={s.show} />
                ))
              }
            </adtFullscreenUi>
          </Scene>
        </Engine>
      </div>
    );
  }

}
export default App;