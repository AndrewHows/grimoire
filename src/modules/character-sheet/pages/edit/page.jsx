import {
	defaultLayout,
	processCharacter,
} from '@/modules/character-sheet/character';
import { useCharacters } from '@/modules/character-sheet/hooks/characters';
import { Sheet } from '../../components/sheet/sheet';
import { Stack } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { createJSONEditor } from 'vanilla-jsoneditor';

import { CharacterEditor } from './components/character-editor';
import { Controls } from './components/controls';

export const EditCharacter = () => {
	const loader = useLoaderData();
	const characters = useCharacters();
	const [mode, setMode] = useState('ui');
	const [json, setJson] = useState({ json: {} });
	const refContainer = useRef();
	const refEditor = useRef();

	const updateJson = (data) => {
		refEditor.current.set({ json: data });
		setJson({ json: data });
	};

	const character = characters.find((d) => d.id === loader?.id);
	useEffect(() => {
		if (!refEditor.current) return;
		if (!character) {
			updateJson({});
			return;
		}
		updateJson({
			...character.data(),
			layout:
				character.data().layout && typeof character.data().layout === 'object'
					? character.data().layout
					: defaultLayout,
		});
	}, [character?.id, refEditor.current]);

	useEffect(() => {
		refEditor.current = createJSONEditor({
			target: refContainer.current,
			props: {
				mode: 'code',
				mainMenuBar: false,
				onChange: ({ text }) => {
					setJson({ json: JSON.parse(text) });
				},
			},
		});

		return () => {
			if (refEditor.current) {
				refEditor.current.destroy();
				refEditor.current = null;
			}
		};
	}, []);

	const characterData = useMemo(() => processCharacter(json.json), [json.json]);

	const setJsonProp = (path, key, value) => {
		const newJson = { ...json.json };
		let item = newJson;
		for (const p of path) {
			item = item[p];
		}
		item[key] = value;
		updateJson(newJson);
	};

	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					maxHeight: '100vh',
					gap: '2rem',
					width: '100%',
					overflow: 'hidden',
				}}
			>
				<Controls
					character={json.json}
					onCharacterChange={updateJson}
					onCharacterPropChange={setJsonProp}
					mode={mode}
					onModeChange={setMode}
				/>

				<div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
					<Stack style={{ width: '100%', height: '100%' }}>
						<div
							style={{
								overflow: 'auto',
								maxHeight: 'calc(100vh - 9.5rem)',
								flex: 1,
							}}
						>
							<div
								ref={refContainer}
								style={{
									width: '100%',
									height: '100%',
									display: mode === 'code' ? 'block' : 'none',
								}}
							/>
							<div
								style={{
									width: '100%',
									height: '100%',
									display: mode === 'ui' ? 'block' : 'none',
								}}
							>
								<CharacterEditor data={characterData} onChange={setJsonProp} />
							</div>
						</div>
					</Stack>
					<div
						style={{
							overflow: 'auto',
							maxHeight: 'calc(100vh - 9.5rem)',
							width: 'calc(210mm + 4rem + 10mm)',
							flexShrink: 0,
						}}
					>
						<Sheet character={characterData} />
					</div>
				</div>
			</div>
		</>
	);
};
