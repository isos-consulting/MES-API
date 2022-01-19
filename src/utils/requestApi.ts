// import axios from 'axios';

// const requsetApi = (options: request.RequiredUriUrl & request.CoreOptions, returnType: 'json' | 'xml' | 'string' = 'json', callback?: request.RequestCallback) => {
//   return new Promise<any>((resolve, reject) => {
    

//     request(
//       options, 
//       callback ? callback : (error: any, response: any, body: any) => {
//         if (error) reject(error);
//         if (response.statusCode >= 400) {
//           reject('Invalid status code <' + response.statusCode + '>');
//         }
//         switch (returnType) {
//           case 'json': resolve(typeof body === 'object' ? body : JSON.parse(body)); break;
//           case 'xml': resolve(JSON.parse(body)); break;
//           case 'string': resolve(body); break;
//         }
//       }
//     );
//   });
// }

// export default requsetApi;