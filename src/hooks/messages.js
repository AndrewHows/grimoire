import { LANGUAGES } from '@/constants.js';
import { Language } from '@/contexts.js';
import { useContext, useEffect, useState } from 'react';

const langProxy = new Proxy(
	{},
	{
		get(target, name) {
			return () => name;
		},
	}
);

export const useMessages = () => {
	const { language: lang } = useContext(Language);
	const [messages, setMessages] = useState();

	useEffect(() => {
		(async () => {
			let data, specificLang;
			try {
				specificLang = lang;
				data = (await import(`../messages/${specificLang}.js`))['default'];
			} catch {
				try {
					specificLang = lang.split('-')[0];
					data = (await import(`../messages/${specificLang}.js`))['default'];
				} catch {
					specificLang = LANGUAGES[0].code;
					data = (await import(`../messages/${specificLang}.js`))['default'];
				}
			}
			const proxy = new Proxy(data, {
				get(target, name, receiver) {
					if (Reflect.has(target, name, receiver)) {
						return Reflect.get(target, name, receiver);
					}
					console.log(`${specificLang} missing translation for key "${name}"`);
					return () => name;
				},
			});
			setMessages(proxy);
		})().catch(console.log);
	}, [lang]);

	if (!messages) return langProxy;

	return messages;
};
