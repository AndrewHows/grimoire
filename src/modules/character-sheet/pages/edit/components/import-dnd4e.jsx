import { firebase } from '@/lib/firebase';
import { defaultLayout } from '@/modules/character-sheet/character';
import { Button } from '@mantine/core';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useRef } from 'react';

const functions = getFunctions(firebase);
const generateJson = httpsCallable(functions, 'generateJson');

const mergeElements = (baseElements, newElements) => {
	baseElements.forEach((item, idx) => {
		baseElements[idx] = {
			...newElements?.find(({ name }) => name === item.name),
			...item,
		};
	});
};

export const ImportDND4E = ({ existingData, onImport }) => {
	const refFile = useRef();
	return (
		<>
			<input
				type="file"
				ref={refFile}
				value=""
				onChange={async (e) => {
					const xml = await e.target.files[0].text();
					refFile.current.value = '';
					const { data: newData } = await generateJson(xml);
					Object.entries(existingData).forEach(([key, value]) => {
						if (!newData[key]) newData[key] = value;
					});
					['racial_features', 'class_features', 'feats'].forEach((group) =>
						mergeElements(newData[group], existingData?.[group])
					);
					mergeElements(newData.powers, existingData?.powers);
					mergeElements(newData.items, existingData?.items);
					newData.powers.forEach((power, idx) => {
						mergeElements(
							newData.powers[idx].text,
							existingData.powers?.find(({ name }) => name === power.name)?.text
						);
					});
					newData.items.forEach((_, idx) => {
						newData.items[idx].properties.forEach((property, propertyIdx) => {
							newData.items[idx].properties[propertyIdx] = {
								...existingData?.items?.[idx]?.properties?.[propertyIdx],
								...property,
							};
						});
						newData.items[idx].powers.forEach((_, powerIdx) => {
							mergeElements(
								newData.items[idx].powers[powerIdx].text,
								existingData?.items?.[idx]?.powers?.[powerIdx]?.text
							);
						});
					});
					if (!newData.layout) newData.layout = defaultLayout;
					onImport(newData);
				}}
				style={{ display: 'none' }}
			/>
			<Button onClick={() => refFile.current.click()}>Import .DND4E</Button>
		</>
	);
};
