type Translation = { lang: string };
export function selectTranslation<T extends Translation>(translations:T[]|undefined,locale:string):T|undefined{return translations?.find(x=>x.lang.toLowerCase()===locale.toLowerCase())??translations?.find(x=>x.lang.toLowerCase()==='en')??translations?.[0]}
