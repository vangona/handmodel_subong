export enum SupabaseError {
	ImageUploadError = 'Image Upload Error',
	ImageDeleteError = 'Image Delete Error',
	EditPostError = 'Edit Post Error',
	FetchPostError = 'Fetch Post Error',
	DashboardError = 'Dashboard Error',
}

export enum SupabaseSuccess {
	PostAddSuccess = 'Post Add Success',
	PostEditSuccess = 'Post Edit Success',
}

export enum SupabaseInfo {
	PostAddInfo = '포스트 추가 성공',
	PostEditInfo = '포스트 수정 성공',
}

export enum SupabaseStorage {
	PostImages = 'post-images',
	MainImages = 'main-images',
}

export enum SupabaseTable {
	Posts = 'posts',
	MainImages = 'main_images',
	Categories = 'categories',
}
