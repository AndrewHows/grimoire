import { EditMonster } from '@/modules/monsters/pages/edit/page';
import { ListMonsters } from '@/modules/monsters/pages/list';

export const monsterRoutes = () => [
	{
		path: 'monsters',
		children: [
			{
				index: true,
				Component: ListMonsters,
			},
			{
				path: 'edit',
				children: [
					{
						index: true,
						Component: EditMonster,
					},
					{
						path: ':name',
						loader: (req) => {
							return { id: req.params.name };
						},
						Component: EditMonster,
					},
				],
			},
		],
	},
];
