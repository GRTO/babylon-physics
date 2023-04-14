import { FC } from 'react';

import "@babylonjs/core/Physics/physicsEngineComponent" // side-effect adds scene.enablePhysics function
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent"; // side-effect for shadow generator
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CannonJSPlugin } from '@babylonjs/core/Physics';
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor';
import { Scene, Engine } from 'react-babylonjs';
import { Color3 } from '@babylonjs/core';
import * as CANNON from 'cannon';

import { Sphere } from "./components/Sphere";

import './app.scss';
import { Coin } from './components/Coin';

window.CANNON = CANNON;

const RADIUS = 5;
const NUMBER_OF_BOXES = 8;

const gravityVector = new Vector3(0, -9.81, 0);

const App: FC = () => {
	return (
		<div className="App">
      <Engine antialias={true} adaptToDeviceRatio={true} canvasId="sample-canvas">
        <Scene enablePhysics={[gravityVector, new CannonJSPlugin()]}>
          <arcRotateCamera name="arc" target={new Vector3(0, 1, 0)}
            alpha={-Math.PI / 2} beta={(0.2 + (Math.PI / 4))} wheelPrecision={50}
            radius={17} minZ={0.001} lowerRadiusLimit={8} upperRadiusLimit={20} upperBetaLimit={Math.PI / 2} />
            <hemisphericLight name='hemi' direction={new Vector3(0, -1, 0)} intensity={0.8} />

            <directionalLight name="shadow-light" setDirectionToTarget={[Vector3.Zero()]} direction={Vector3.Zero()} position={new Vector3(-40, 30, -40)}
              intensity={0.4} shadowMinZ={1} shadowMaxZ={2500}>
              <shadowGenerator mapSize={1024} useBlurExponentialShadowMap={true} blurKernel={32} darkness={0.8} forceBackFacesOnly={true} depthScale={100} shadowCastChildren>
                {Array.from(new Array(NUMBER_OF_BOXES), (_, index) => index).map(x => (
                  <Sphere
                    name={x.toFixed()}
                    position={new Vector3(Math.cos(2 * Math.PI / NUMBER_OF_BOXES * x) * RADIUS, 3 + Math.random() * 3, Math.sin(2 * Math.PI / NUMBER_OF_BOXES * x) * RADIUS)}
                    color={new Color3(Math.abs(x -(NUMBER_OF_BOXES/2)) / 10, Math.abs(x -(NUMBER_OF_BOXES/2)) / 10, Math.abs(x -(NUMBER_OF_BOXES/2)) / 10)}
                  />
                ))}
                <Coin
                  color={new Color3(0, 0, 255)}
                  name="Coin"
                  position={new Vector3(0, 5, 10)}
                />
              </shadowGenerator>
            </directionalLight>

            <ground name="ground1" width={24} height={24} subdivisions={2} receiveShadows={true}>
              <physicsImpostor type={PhysicsImpostor.BoxImpostor} _options={{ mass: 0, restitution: 0.9 }} />
            </ground>
        </Scene>
      </Engine>
		</div>
	)
}

export default App;
