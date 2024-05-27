<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let scrollContainer: HTMLElement | undefined;

	onMount(async () => {
		const { default: LocomotiveScroll } = await import('locomotive-scroll');

		const scroller = new LocomotiveScroll({
			el: scrollContainer,
			smooth: true
		});

		gsap.registerPlugin(ScrollTrigger);

		scroller.on('scroll', ScrollTrigger.update);

		ScrollTrigger.scrollerProxy('.container', {
			getBoundingClientRect() {
				return {
					left: 0,
					top: 0,
					width: window.innerWidth,
					height: window.innerHeight
				};
			}
		});

		ScrollTrigger.create({
			trigger: '.image-mask',
			scroller: '.container',
			start: 'top+=30% 50%',
			end: 'bottom-=40% 50%',
			animation: gsap.to('.image-mask', { backgroundSize: '120%' }),
			scrub: 2
			// markers: true
		});

		ScrollTrigger.addEventListener('refresh', () => {
			scroller.update();
		});

		ScrollTrigger.refresh();
	});
</script>

<div data-scroll-container class="container" bind:this={scrollContainer}>
	<div class="hero">
		<div data-scroll data-scroll-speed="3" class="copy">
			<blockquote>
				“It’s one thing to make a <span>picture</span> of what a person looks like, it’s another
				thing to make a <span>potrait</span> of who they are.”
				<cite> — Paul Caponigro </cite>
			</blockquote>
		</div>
		<div class="image-wrapper">
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2Fmonochrome-photo-of-woman-3410386.jpg?alt=media&token=112f9717-ef7e-46e1-8952-b3e346f8f008"
				alt=""
			/>
		</div>
	</div>

	<div class="section-0" data-scroll data-scroll-speed="2">
		<p data-scroll data-scroll-direction="horizontal" data-scroll-speed="-2">
			Travelling leaves you speechless
		</p>
		<p data-scroll data-scroll-direction="horizontal" data-scroll-speed="2">
			Then it turns you to a storyteller
		</p>

		<cite>— Ibn Battuta</cite>
	</div>

	<div class="section-1">
		<div class="image-mask"></div>
	</div>

	<div class="section-2">
		<div id="pinSection" class="pinned-quote">
			<blockquote data-scroll data-scroll-sticky data-scroll-target="#pinSection">
				“To me, photography is an art of observation. It’s about finding something interesting in an
				ordinary place… I’ve found it has little to do with the things you see and everything to do
				with the way you see them.”

				<cite> — Elliott Erwitt </cite>
			</blockquote>
		</div>

		<div class="images-container">
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2F666238d6f903c8899fa76789ed59912d.jpg?alt=media&token=fed407c6-a469-43cd-af23-5d7bb36c0f0e"
				alt=""
			/>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2Fbca413679414c189fdff16e15edd7726.jpg?alt=media&token=23dfcb96-b5b0-47ac-8105-e2c9a08c437b"
				alt=""
			/>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2F24cf1a08cbaabf899d9d9872e20452b6.jpg?alt=media&token=7d44f884-e4dc-4775-b15d-001b9868de38"
				alt=""
			/>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2F37ff280cdb9a9ff5a8aebb482a7c1b73.jpg?alt=media&token=611f6188-574c-4456-bdd1-c20b2e024b0a"
				alt=""
			/>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2F81c20e1c1c9e380395bff6ff651fc2e7.jpg?alt=media&token=d0fa44b4-b518-4754-ae1d-929a08972c25"
				alt=""
			/>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2Fb4a0ce2c6d0e9ffd4792561e122bfb1e.jpg?alt=media&token=d32ec2b6-0902-4cb5-ae28-d22c87858407"
				alt=""
			/>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2Fd137584c758fd75b3191220df2934ce9.jpg?alt=media&token=34fcda56-27ea-43f5-a8c0-256783a053f8"
				alt=""
			/>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2Fmonochrome-photo-of-woman-covering-her-eye-2928525.jpg?alt=media&token=34786a3f-935d-4465-9d86-f837967e07cb"
				alt=""
			/>
		</div>
	</div>

	<div class="section-3">
		<div class="image-wrapper">
			<img
				src="https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2F0984c01ecccd4282d73a74962ea59889.jpg?alt=media&token=4b859d79-7055-4584-9c0a-b44a2cdd4e66"
				alt=""
			/>
		</div>
		<div class="copy">
			<blockquote data-scroll-speed="3" data-scroll>
				If a picture is worth a thousand words, words must be priceless
			</blockquote>
		</div>
		<p class="copyright" data-scroll-position="bottom" data-scroll-speed="2" data-scroll>
			&copy; Layout Explorations, ebinabo, 2020
		</p>
	</div>
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Cormorant Garamond';
	}

	.container {
		background: #dfdfdf;

		.hero {
			display: grid;
			grid-template-columns: 60% 40%;
			height: 100vh;

			.copy {
				display: grid;
				align-content: center;
				padding: 0 1rem;
				height: 100%;

				blockquote {
					font-size: 6vmin;
					font-weight: 300;

					span {
						font-style: italic;
						font-weight: 400;
					}

					cite {
						font-weight: 300;
						font-style: italic;
						font-size: 4.5vmin;
						display: block;
						padding: 8px 0;
					}
				}
			}

			.image-wrapper {
				height: 100vh;
				width: 100%;

				img {
					height: 100%;
					width: 100%;
					object-fit: cover;
				}
			}
		}

		.section-0 {
			margin-top: 20vh;
			text-align: center;

			p {
				font-size: 5vw;
			}

			cite {
				//   display: block;
				font-size: 3vw;
			}
		}

		.section-1 {
			height: 100vh;
			display: grid;
			place-content: center;
			padding: 0 1rem;

			.image-mask {
				width: 80vw;
				height: 80vh;
				background: url('https://firebasestorage.googleapis.com/v0/b/hashnode-tutorials.appspot.com/o/bwimages%2Ftumblr_n92tblyC8d1s3sziio1_1280.jpg?alt=media&token=c5d75884-4bc3-46bb-815d-414d2ec68e4b');
				// background-attachment: fixed;
				background-size: cover;
				background-position-x: 50%;
				background-position-y: 90%;
				background-size: 100%;

				img {
					height: 100%;
					width: 100%;
					object-fit: cover;
				}
			}

			blockquote {
				font-size: 9vmin;
				font-weight: 300;

				span {
					font-style: italic;
					font-weight: 400;
				}

				cite {
					font-weight: 300;
					font-style: italic;
					font-size: 7.5vmin;
					display: block;
					padding: 8px 0;
				}
			}
		}

		.section-2 {
			height: calc(300vh + 32px + 16px);
			display: grid;
			grid-template-columns: 1fr 2fr;
			grid-template-columns: 40% 60%;

			blockquote {
				font-size: 5vmin;
				padding: 16px 16px 0 16px;

				cite {
					display: block;
				}
			}

			.images-container {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				padding: 0 8px;
				gap: 8px;
				margin-top: 16px;

				img {
					width: 100%;
					max-height: 75vh;
					height: 100%;
					align-self: stretch;
					object-fit: cover;
				}
			}
		}

		.section-3 {
			height: 100vh;
			display: grid;
			grid-template-columns: 40% 60%;
			position: relative;

			.image-wrapper {
				height: 100%;
				width: 100%;

				img {
					height: 100%;
					width: 100%;
					object-fit: cover;
				}
			}

			.copy {
				font-size: 8vmin;
				height: 100vh;
				width: 100%;
				display: grid;
				align-content: center;

				blockquote {
					margin: 0 32px;
				}
			}

			.copyright {
				position: absolute;
				bottom: 5%;
				left: 50%;
				font-size: 4vmin !important;
			}
		}
	}
</style>
