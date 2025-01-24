import { Column, Row } from '../components/layout';
import { Page } from '../components/page';
import { Attributes } from '../sections/attributes';
import { Defences } from '../sections/defences';
import { Features } from '../sections/features';
import { Health } from '../sections/health';
import { Movement } from '../sections/movement';
import { Portrait } from '../sections/portrait';
import { PowerPoints } from '../sections/power-points';
import { Powers } from '../sections/powers';
import { Saves } from '../sections/saves';
import { Senses } from '../sections/senses';
import { Skills } from '../sections/skills';
import { Traits } from '../sections/traits';

export const DefaultLayout = () => (
	<>
		<Page>
			<Column>
				<Traits />
				<Row style={{ gap: '2rem' }}>
					<Column>
						<Portrait />
						<Attributes />
						<Skills />
					</Column>
					<Column>
						<PowerPoints />
						<Health />
						<Defences />
						<Features />
					</Column>
					<Column>
						<Movement />
						<Senses />
						<Saves />
					</Column>
				</Row>
			</Column>
		</Page>
		<Powers />
	</>
);
