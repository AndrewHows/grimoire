import { InfoBox } from '@/components/info-box';
import { useFeature } from '@/modules/feature-flags/hooks/feature';

export const Home = () => {
	const canUseTest = useFeature('home-box');
	return (
		<>
			{canUseTest && <InfoBox centered>Test</InfoBox>}
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et
				leo ut lectus luctus rutrum id non lorem. Aenean et neque iaculis ante
				congue posuere. Interdum et malesuada fames ac ante ipsum primis in
				faucibus. Praesent et purus sed sem varius fringilla eu id lorem. Fusce
				fermentum vulputate dui sit amet feugiat. Suspendisse sodales turpis in
				eros suscipit vestibulum. Curabitur dapibus pulvinar risus vitae luctus.
				Ut dictum turpis ut congue ultrices. Suspendisse sit amet augue ante.
				Vestibulum rhoncus ligula in felis molestie elementum. Proin semper enim
				lacus, eget sollicitudin dolor interdum id. Donec varius et arcu at
				finibus. Aliquam magna orci, laoreet eget quam et, malesuada congue
				elit. Phasellus lectus odio, dictum ac lobortis quis, gravida at elit.
			</p>
			<p>
				Fusce nec odio faucibus, convallis libero in, feugiat neque. Proin eros
				ipsum, facilisis suscipit ultricies quis, porttitor sit amet justo.
				Vivamus in sollicitudin urna. Vivamus efficitur luctus ex, quis maximus
				sem molestie at. Curabitur ut suscipit urna, nec euismod lectus. Nam
				dictum eget purus a gravida. Suspendisse sed nulla id justo ullamcorper
				convallis sit amet a leo. Etiam in varius tortor.
			</p>
			<p>
				Curabitur ultrices molestie eros laoreet viverra. Sed vitae felis lacus.
				Maecenas luctus nisi sed congue porta. Integer porttitor nunc non
				posuere imperdiet. Nullam euismod nec mi nec consectetur. Sed ultricies
				vulputate metus at faucibus. Nullam ipsum leo, malesuada eu facilisis
				sit amet, molestie vitae lorem. Vivamus dapibus orci felis. Nunc id
				fermentum lectus. Vestibulum blandit vulputate feugiat. Morbi libero
				tellus, auctor vel iaculis in, vehicula eget velit.
			</p>
			<p>
				Etiam non leo iaculis, viverra nibh at, pellentesque arcu. Etiam viverra
				ipsum id ipsum viverra finibus. Mauris at augue a elit convallis
				faucibus quis condimentum purus. Integer mauris felis, lobortis a
				tincidunt non, eleifend id dui. Nam a dignissim dolor. Duis eu
				consectetur est, sit amet vulputate elit. Curabitur interdum velit eu
				scelerisque mattis. Vestibulum tortor risus, efficitur sed ullamcorper
				id, pulvinar id urna. Etiam pharetra venenatis orci, eu blandit quam
				dictum sit amet. Duis elementum risus nec urna pretium, vitae accumsan
				dolor accumsan. Sed faucibus eu magna non pulvinar.
			</p>
			<p>
				Phasellus consequat eu urna quis elementum. Sed enim magna, lacinia id
				ullamcorper vitae, egestas id augue. Sed volutpat imperdiet est eu
				accumsan. Mauris condimentum, magna sed consectetur ultrices, massa ex
				sodales tortor, non faucibus elit nunc sed dolor. Vestibulum nunc
				ligula, condimentum at tincidunt id, tempus nec tellus. Proin laoreet
				enim a consectetur accumsan. Vestibulum ornare dui venenatis sapien
				commodo, a aliquet risus eleifend.
			</p>
			<p>
				Donec quis vestibulum purus. Nam interdum luctus enim non placerat.
				Donec quam erat, varius et luctus eu, placerat vitae massa. Pellentesque
				id eros condimentum, efficitur massa venenatis, luctus lectus. Nulla
				facilisi. Phasellus et ultricies diam. Vivamus fermentum, lacus a
				efficitur fermentum, turpis purus ornare ligula, id varius diam mi at
				eros. Quisque vel arcu non tellus auctor feugiat et vitae enim.
			</p>
			<p>
				Vivamus tristique est sit amet urna porttitor lacinia. Mauris fringilla
				tortor vitae velit dapibus hendrerit. Class aptent taciti sociosqu ad
				litora torquent per conubia nostra, per inceptos himenaeos. Phasellus
				ullamcorper lorem et ornare tristique. Ut a vehicula enim. Nullam eu
				ornare sem. Nulla interdum tristique dictum.
			</p>
			<p>
				Duis porttitor accumsan metus vitae venenatis. Praesent non vestibulum
				urna, non ultricies nisi. Donec hendrerit metus lectus, vitae blandit
				quam pharetra eget. Proin quam urna, luctus ac consectetur sed, euismod
				a magna. Donec at massa eget lectus vehicula porta et id tortor. Donec
				rhoncus gravida ante, lacinia euismod enim facilisis eu. Phasellus
				condimentum arcu magna, sit amet sodales leo venenatis eget. Aenean sed
				erat sodales, hendrerit orci sit amet, gravida eros. Aenean risus
				tellus, vehicula eu tristique vitae, efficitur quis nisi. Orci varius
				natoque penatibus et magnis dis parturient montes, nascetur ridiculus
				mus. Donec interdum dui a efficitur sollicitudin. Pellentesque dui
				lacus, sollicitudin in tincidunt eu, aliquam vitae nulla. Vivamus congue
				ex at turpis feugiat lacinia. Fusce egestas leo lorem, sed dictum est
				dictum vel. Etiam eget ipsum ac ipsum eleifend maximus.
			</p>
			<p>
				Suspendisse erat nisl, pellentesque a purus in, viverra ullamcorper
				quam. Phasellus hendrerit blandit sem, non elementum ante mattis a.
				Nullam cursus vulputate mauris eget consequat. Suspendisse et tristique
				quam, pellentesque dapibus odio. Curabitur neque ligula, bibendum a
				ullamcorper et, accumsan a orci. Nullam mattis dui imperdiet tincidunt
				sodales. Morbi porttitor magna ac ipsum gravida, sit amet laoreet diam
				condimentum. Praesent consequat laoreet quam, ut rutrum nisl hendrerit
				non.
			</p>
			<p>
				Sed vulputate neque a risus accumsan tristique. Ut accumsan velit a ante
				pharetra luctus. Nulla et accumsan urna, vitae vehicula massa. Vivamus
				et quam porta, aliquam quam ac, porta mi. Curabitur scelerisque risus
				vitae aliquet commodo. Praesent volutpat semper felis vitae ullamcorper.
				Nam feugiat pellentesque finibus. Fusce vulputate elementum nisi, vel
				imperdiet neque dapibus ut. Nam vestibulum dignissim diam, nec bibendum
				lectus porttitor rhoncus. Aliquam rutrum mauris at viverra ornare.
			</p>
			<p>
				Nunc in lorem ut nunc tempor dictum. Quisque et pellentesque velit, eget
				tempus quam. Sed vel finibus libero, non dignissim lorem. Cras accumsan
				nisl ac mi sagittis, et laoreet metus venenatis. Vivamus sit amet
				molestie risus. Curabitur luctus ac lacus quis luctus. Nulla facilisi.
				Aenean ornare fermentum urna, at pulvinar magna imperdiet at. Nunc
				feugiat ut odio id rutrum.
			</p>
		</>
	);
};
