import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";

// @Public: Những routes nào không muốn JWT
export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // key: value
// End @Public

// @User: Lấy thông tin user đăng nhập
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
// End @User

// @ResponseMessage: Truyền thông tin message 
export const RESPONSE_MESSAGE = "response_message";
export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE, message);
// End @ResponseMessage