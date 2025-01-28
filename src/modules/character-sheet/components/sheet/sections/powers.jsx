import { useContext } from 'react';
import { Page } from '../components/page';
import { Power } from '../components/power';
import { Character } from '../context';
import { sortPowers } from '@/modules/character-sheet/utils';

export const Powers = () => {
	const { character } = useContext(Character);

	return new Array(Math.ceil((character.powers.length ?? 0) / 9))
		.fill(null)
		.map((_, idx) => (
			<Page key={idx}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
					{character.powers
						.sort(sortPowers(character))
						.slice(idx * 9, (idx + 1) * 9)
						.map((p, pidx) => (
							<Power key={`${p.name}-${pidx}`} power={p} />
						))}
				</div>
			</Page>
		));
};
