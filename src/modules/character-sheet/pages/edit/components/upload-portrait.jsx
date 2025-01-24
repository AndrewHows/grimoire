import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { Button } from '@mantine/core';
import { firebase } from '@/lib/firebase';
import { useContext, useRef } from 'react';
import { Auth } from '@/contexts';

const storage = getStorage(firebase);

export const UploadPortrait = ({ filename, onUpload, maxSize = 400 }) => {
	const refImage = useRef();
	const { user } = useContext(Auth);

	return (
		<>
			<input
				ref={refImage}
				style={{ display: 'none' }}
				type="file"
				onChange={(fileEvent) => {
					const reader = new FileReader();
					if (fileEvent.target.files.length === 0) return;

					reader.onload = (readerEvent) => {
						const canvas = document.createElement('canvas');
						canvas.style.display = 'none';
						const img = new Image();
						img.style.display = 'none';
						document.body.appendChild(canvas);
						img.addEventListener('load', () => {
							var ctx = canvas.getContext('2d');
							var canvasCopy = document.createElement('canvas');
							var copyContext = canvasCopy.getContext('2d');
							var ratio = 1;

							if (img.width > maxSize) {
								ratio = maxSize / img.width;
							} else if (img.height > maxSize) {
								ratio = maxSize / img.height;
							}

							canvasCopy.width = img.width;
							canvasCopy.height = img.height;
							copyContext.drawImage(img, 0, 0);

							canvas.width = img.width * ratio;
							canvas.height = img.height * ratio;
							ctx.drawImage(
								canvasCopy,
								0,
								0,
								canvasCopy.width,
								canvasCopy.height,
								0,
								0,
								canvas.width,
								canvas.height
							);
							canvas.toBlob(
								async (resized) => {
									const parts = fileEvent.target.value.split('.');
									const storageRef = ref(
										storage,
										`${user.uid}/${filename}.${parts[parts.length - 1]}`
									);

									await uploadBytes(storageRef, resized, undefined, {
										cacheControl: 'public, max-age=3600',
									});
									const url = await getDownloadURL(storageRef);

									onUpload(url);
									canvas.parentNode.removeChild(canvas);
									img.parentNode.removeChild(img);
								},
								'image/jpeg',
								0.7
							);
						});
						img.src = readerEvent.target.result;
						document.body.appendChild(img);
					};
					reader.readAsDataURL(fileEvent.target.files[0]);
				}}
			/>
			<Button onClick={() => refImage.current.click()}>Set Portrait</Button>
		</>
	);
};
