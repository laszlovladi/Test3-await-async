document.addEventListener('DOMContentLoaded', () => {

  async function getData(url) {
    try{
      const response = await fetch(url);
      const data = await response.json();
      const buffer = new TextEncoder('utf-8').encode(data.content);      
      const digest = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(digest));
      const sha = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
      let res = {
        content: data.content,
        sha256: sha
      };
      console.log(res);
      postRes('https://test-hermes.profisms.cz/work-tests/test1a.php', res);
      return res;
    }catch(e){
      console.error(e);
    }
  }

  async function postRes(url, res) {
    try{
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(res),
      });
      console.log('status', response.status);
      document.getElementById('data').innerHTML = res.content;
      document.getElementById('sha').innerHTML = res.sha256;
      document.getElementById('status').innerHTML = response.status = 200 ? '"OK" (HTTP 200)' : '"error" (HTTP 500)';
      const data = await response.json();
      return data;
    }catch(e){
      console.error(e);
    }
  }

  getData('https://test-hermes.profisms.cz/work-tests/test1.php');

});