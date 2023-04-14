import { FC, useEffect, useRef } from "react";
import { FresnelParameters } from '@babylonjs/core/Materials/fresnelParameters';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor';
import { Nullable } from '@babylonjs/core/types';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';

type CoinProps = {
	position: Vector3
	name: string
	color: Color3
};

export const Coin: FC<CoinProps> = ({
	color,
	name,
	position,
}) => {
	let cubeRef = useRef<Nullable<Mesh>>(null);
	const adtRef = useRef<AdvancedDynamicTexture | null>(null);
    const physicsImpRef = useRef<PhysicsImpostor | null>(null);

	useEffect(() => {
		if (adtRef.current) {
			console.log('marking dirty');
			adtRef.current!.markAsDirty();
		} else {
			console.log('no ref');
		}
	}, [adtRef]);

    const onThrowCoin = () => {
        if (cubeRef.current) {
            cubeRef.current.physicsImpostor?.applyImpulse(
                new Vector3(0, 0, -10),
				cubeRef.current.getAbsolutePosition(),
            );
        }
    }

    useEffect(() => {
        onThrowCoin();
    }, [physicsImpRef]);

	// setInterval(() => onThrowCoin(), 500)

	return (
        <box
            ref={cubeRef}
            name={`${name}-box`}
            width={2}
            height={2}
            position={position}
        >
            <physicsImpostor
                ref={physicsImpRef}
                type={PhysicsImpostor.BoxImpostor}
                _options={{ mass: 1, restitution: 0.9 }}
            />
            <standardMaterial name={`${name}-material`} specularPower={16}
				diffuseColor={Color3.Blue()}
				emissiveColor={color}
				reflectionFresnelParameters={FresnelParameters.Parse({
					isEnabled: true,
					leftColor: [1, 1, 1],
					rightColor: [0, 0, 0],
					bias: 0.1,
					power: 1
				})}
			/>
        </box>)
}
