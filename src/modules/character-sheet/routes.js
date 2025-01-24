import { EditCharacter } from './pages/edit';
import { ViewCharacter } from './pages/view';

export const characterRoutes = ({ user }) => [
	{
		path: 'character',
		children: [
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
