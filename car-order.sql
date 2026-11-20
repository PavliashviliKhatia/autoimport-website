alter table public.cars add column if not exists display_order integer;
create or replace function public.save_car_order(ordered_ids uuid[])
returns void language plpgsql security invoker set search_path = '' as $$
declare changed integer;
begin
  if ordered_ids is null then raise exception 'Missing order'; end if;
  update public.cars c set display_order = x.pos::integer
  from unnest(ordered_ids) with ordinality as x(id,pos) where c.id=x.id;
  get diagnostics changed = row_count;
  if changed <> cardinality(ordered_ids) then raise exception 'Order not saved: inventory changed or permission denied'; end if;
end;
$$;
revoke all on function public.save_car_order(uuid[]) from public, anon;
grant execute on function public.save_car_order(uuid[]) to authenticated;
