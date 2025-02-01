import { CharacterList } from './pages/list';
import { EditCharacter } from './pages/edit/page';
import { ViewCharacter } from './pages/view';

export const characterRoutes = () => [
	{
		path: 'characters',
		children: [
			{
				index: true,
				Component: CharacterList,
			},
			{
				path: 'edit',
				children: [
					{
						index: true,
						Component: EditCharacter,
					},
					{
						path: ':name',
						loader: (req) => {
							return { id: req.params.name };
						},
						Component: EditCharacter,
					},
				],
			},
		],
	},
];

export const bareCharacterRoutes = () => [
	{
		path: '/sheet/:user/:name',
		loader: (req) => {
			return { uid: req.params.user, id: req.params.name };
		},
		Component: ViewCharacter,
	},
];
