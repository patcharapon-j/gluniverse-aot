/** The reactive holder a mounted sheet reads; the ApplicationV2 shell replaces `view` on each render. */
export class SheetState<V> {
  view = $state.raw<V>() as V;
  tab = $state('soldier');
  bonus = $state(0);
  constructor(view: V, tab = 'soldier') {
    this.view = view;
    this.tab = tab;
  }
}
