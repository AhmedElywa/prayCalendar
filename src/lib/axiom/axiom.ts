import { Axiom } from '@axiomhq/js';

const axiomClient = new Axiom({
  token: process.env.AXIOM_TOKEN!,
  url: process.env.AXIOM_URL || 'https://api.axiom.co',
});

export default axiomClient;
