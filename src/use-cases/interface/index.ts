export interface UseCase<Req, Res> {
  handle(data: Req): Promise<Res>
}
