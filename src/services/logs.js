import axios from 'axios';
/* import config from '../../config'; */

export default {
  async getLogs(date) {
    const url = `https://t1-logs.herokuapp.com/api/logs?date=${date}&source=t1-envios`;
    try {
      const datos = await axios.get(url);
      return datos.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};
