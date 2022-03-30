import post_login from "./post_login";
import post_join from "../community/post_join";
import get_logout from "./get_logout";
import delete_disable from "./delete_disable";
import post_addcomment from "../community/post_addcomment";

export const authController = {
	post_login,
	post_join,
	get_logout,
	delete_disable,
};