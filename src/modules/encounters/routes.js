import { EditEncounter } from '@/modules/encounters/pages/edit/page';
import { ListEncounters } from '@/modules/encounters/pages/list';

export const encounterRoutes = () => [
	{
		path: 'encounters',
		children: [
			{
				index: true,
				Component: ListEncounters,
			},
			{
				path: 'edit',
				children: [
					{
						index: true,
						Component: EditEncounter,
					},
					{
						path: ':name',
						loader: (req) => {
							return { id: req.params.name };
						},
						Component: EditEncounter,
					},
				],
			},
		],
	},
];
