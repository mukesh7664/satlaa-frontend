import Router from "next/navigation";

export default (context = {}, target) => {
   if (context.res) {
      context.res.writeHead(303, { Location: target });
      context.res.end();
   } else {
      Router.replace(target);
   }
};
