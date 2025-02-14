import { CharacterList } from './pages/list';
import { EditCharacter } from './pages/edit/page';
import { ViewCharacter } from './pages/view';
import { EditParty } from '@/modules/characters/pages/party';

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
			{
				path: 'party',
				children: [
					{
						index: true,
						Component: EditParty,
					},
					{
						path: ':name',
						Component: EditParty,
						loader: (req) => {
							return { id: req.params.name };
						},
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
