import post_addpost from "./post_addpost";
import get_mypost from "./get_mypost";
import get_show from "./get_show";
import delete_delete from "./delete_delete";
import get_post from "./get_post";
import post_addcomment from "./post_addcomment";
import patch_changepost from "./patch_changepost";	
import delete_comment from "./delete_comment";
import get_comment from "./get_comment";
import post_addimg from "./post_addimg";
import get_img from "./get_img";
import { delete_img } from "./delete_img";


export const communityController = {
	post_addpost,
	get_mypost,
	get_show,
	delete_delete,
	get_post, 
	post_addcomment, 
	patch_changepost,
	delete_comment,
	get_comment, 
	post_addimg,
	get_img,
	delete_img,
}