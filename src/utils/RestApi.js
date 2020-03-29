class RestApi {
	
	static async get(url, headers) {
		let response = await fetch(url);
		let data = await response.json()
		try {
			return data;
		} catch (error) {
			throw error;
		}
	}


}

export { RestApi };