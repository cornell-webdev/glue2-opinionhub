<script>
	import { afterNavigate } from '$app/navigation';
	import Auth from '$lib/components/glue/Auth.svelte';
	import MobileDrawerContent from '$lib/components/glue/MobileDrawerContent.svelte';
	import { APP_NAME, IS_BETA, PUBLIC_NAVS } from '$lib/glue/config';
	import IconSearch from '$lib/icons/glue/IconSearch.svelte';
	import CourseSearch from '../CourseSearch.svelte';
	import './app.css';
	import FeedbackModal from './FeedbackModal.svelte';
	import TrackWidth from './TrackWidth.svelte';

	let isSearchExpanded = false;
	let topAnchor;

	afterNavigate(() => {
		if (topAnchor) {
			topAnchor.scrollIntoView();
		}
	});
</script>

<TrackWidth />

<div class="w-screen">
	<div class="drawer">
		<!-- mobile nav: invisible drawer toggle -->
		<input id="drawer-mobile-nav" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col items-center">
			<div bind:this={topAnchor} />

			<!-- header -->
			<div class="sticky top-0 z-30 flex w-full justify-center bg-base-100/95">
				<div class={`w-full max-w-4xl`}>
					<div class="navbar">
						<!-- mobile nav: hamburger -->
						<div class={`${isSearchExpanded ? 'hidden' : 'block'} md:block`}>
							{#if PUBLIC_NAVS?.length > 0}
								<div class="flex-none md:hidden">
									<label for="drawer-mobile-nav" class="btn-ghost drawer-button btn-square btn">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											class="inline-block h-5 w-5 stroke-current"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 6h16M4 12h16M4 18h16"
											/></svg
										>
									</label>
								</div>
							{/if}
						</div>

						<!-- app name -->
						<div class="{isSearchExpanded ? 'hidden' : 'block'} md:block">
							<button>
								<a href="/" class="btn-ghost btn text-xl normal-case"
									>{APP_NAME}
									{#if IS_BETA}
										<span class="ml-1.5 text-base-content/60">beta</span>
									{/if}
								</a>
							</button>
						</div>

						<!-- collapsed app name (mobile only) -->
						<div class="{isSearchExpanded ? 'block' : 'hidden'} md:hidden">
							<button>
								<a href="/" class="btn-ghost btn-sm btn text-xl normal-case">Op</a>
							</button>
						</div>

						<!-- right side menu -->
						<div class="flex flex-1 justify-end space-x-2">
							<div class="hidden md:block">
								<div class="menu menu-horizontal p-2">
									{#if PUBLIC_NAVS?.length > 0}
										{#each PUBLIC_NAVS as nav}
											<li class="font-medium"><a href={nav.path}>{nav.label}</a></li>
										{/each}
									{/if}
								</div>
							</div>

							<!-- search -->
							<div class={`${isSearchExpanded ? 'block' : 'hidden'} w-full md:block`}>
								<CourseSearch />
							</div>
							<div class={`md:hidden ${isSearchExpanded ? 'hidden' : 'block'}`}>
								<button
									class=" btn-primary btn-sm btn"
									on:click={() => {
										isSearchExpanded = true;
									}}><span class="text-2xl"><IconSearch /></span></button
								>
							</div>

							<Auth />
						</div>
					</div>
				</div>
			</div>
			<div class="relative w-full max-w-4xl p-4 md:pl-6">
				<!-- body content -->
				<div class="min-h-[82vh]">
					<slot />
				</div>

				<!-- footer -->
				<footer class="footer footer-center bg-base-100 py-8 text-base-content">
					<div>
						<p>{APP_NAME} © 2022</p>
					</div>
				</footer>

				<!-- feedback -->
				<FeedbackModal />
			</div>
		</div>

		<!-- mobile nav: drawer content -->
		<MobileDrawerContent />
	</div>
</div>
