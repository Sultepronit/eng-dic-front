const apiUrl = import.meta.env.VITE_API_URL;

async function getArticle(dic, query) {
    const urls = [
        `http://localhost:8989/?dic=${dic}&word=${encodeURIComponent(query)}`,
        `${apiUrl}/${dic}?word=${encodeURIComponent(query)}`
    ];

    const fetchAll = urls.map(url => fetch(url).then(resp => {
        if(resp.ok) {
            return resp;
        }
    }));

    try {
        const resp = await Promise.any(fetchAll);
        return await resp.text();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default getArticle;