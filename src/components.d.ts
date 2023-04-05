import { ComponentConstructor } from 'quasar';

type Quasar = typeof import('quasar');
type QuasarComponentNames = keyof { [K in keyof Quasar as (Quasar)[K] extends ComponentConstructor<infer _> ? K : never]: any };
type QuasarComponents = Pick<Quasar, QuasarComponentNames>;
type QuasarFuncationalComponents = { [K in keyof QuasarComponents]: Quasar[K] extends ComponentConstructor<infer C> ? (props: Partial<C>) => void : never };

declare module '@vue/runtime-dom' {  // Vue <= 2.6.14
	export interface GlobalComponents extends QuasarFuncationalComponents { }
}
