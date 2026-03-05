'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { FiMenu } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LanguageSwitcher } from './language-switcher'
import { ThemeToggle } from './theme-toggle'

const navKeys = [
	'home',
	'courses',
	'results',
	'teachers',
	'about',
	'contact',
] as const

function localePath(locale: string, slug = '') {
	return `/${locale}${slug}`
}

export function Navbar() {
	const t = useTranslations('navbar')
	const locale = useLocale()
	const pathname = usePathname()

	function navHref(key: (typeof navKeys)[number]) {
		return key === 'home' ? localePath(locale) : localePath(locale, `/${key}`)
	}

	function isActive(href: string) {
		return pathname === href
	}

	return (
		<header className='sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur'>
			<div className='site-container flex h-16 items-center justify-between gap-3 sm:h-20'>
				<Link
					href={localePath(locale)}
					className='flex min-w-0 items-center gap-3'
				>
					<span className='flex h-9 w-9 items-center justify-center rounded-md bg-primary font-black text-primary-foreground'>
						N
					</span>
					<span className='truncate text-base font-extrabold tracking-tight sm:text-lg'>
						{t('brand')}
					</span>
				</Link>

				<nav className='hidden items-center gap-7 lg:flex'>
					{navKeys.map(key => {
						const href = navHref(key)
						return (
							<Link
								key={key}
								href={href}
								className={`text-sm font-semibold transition-colors hover:text-foreground ${
									isActive(href) ? 'text-primary' : 'text-muted-foreground'
								}`}
							>
								{t(`links.${key}`)}
							</Link>
						)
					})}
				</nav>

				<div className='flex items-center gap-2'>
					<ThemeToggle />
					<LanguageSwitcher />
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant='outline'
								size='sm'
								className='h-10 w-10 p-0 lg:hidden'
								aria-label='Open menu'
							>
								<FiMenu className='h-5 w-5' />
							</Button>
						</SheetTrigger>
						<SheetContent>
							<div className='mt-8 mb-3 flex items-center gap-2'>
								<ThemeToggle />
								<LanguageSwitcher />
							</div>
							<nav className='flex flex-col gap-3'>
								{navKeys.map(key => {
									const href = navHref(key)
									return (
										<Link
											key={key}
											href={href}
											className={`rounded-md px-3 py-3 text-base font-semibold transition-colors hover:bg-muted hover:text-foreground ${
												isActive(href) ? 'text-primary' : 'text-muted-foreground'
											}`}
										>
											{t(`links.${key}`)}
										</Link>
									)
								})}
								<Button className='mt-3 h-11 w-full'>{t('cta')}</Button>
							</nav>
						</SheetContent>
					</Sheet>
					<Button size='sm' className='hidden h-11 sm:inline-flex'>
						{t('cta')}
					</Button>
				</div>
			</div>
		</header>
	)
}
