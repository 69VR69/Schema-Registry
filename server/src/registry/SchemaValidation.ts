import { buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLField, GraphQLInputObjectType } from 'graphql';


export function validateContent(schemaString: string, content: any): boolean {
  try {
    // Construction dud graphqlschema
    const schema: GraphQLSchema = buildSchema(schemaString);

    // Récupérer le type de requête (Query) et mutation (Mutation) du schéma
    const queryType: GraphQLObjectType = schema.getQueryType() as GraphQLObjectType;
    const mutationType: GraphQLObjectType = schema.getMutationType() as GraphQLObjectType;

    // Valider le contenu utilisateur par rapport au type de requête (Query)
    if (queryType) {
      const queryFields: GraphQLField<any, any>[] = Object.values(queryType.getFields());
      for (const field of queryFields) {
        const fieldName: string = field.name;
        const fieldValue: any = content[fieldName];

        if (fieldValue === undefined) {
          console.error(`Field '${fieldName}' is missing in the content`);
          return false;
        }

        // Valider les champs imbriqués
        if (field.type instanceof GraphQLObjectType || field.type instanceof GraphQLInputObjectType) {
          // validation de maniere recursive
          const isValidNestedContent: boolean = validateContent(field.type.toString(), fieldValue);
          if (!isValidNestedContent) {
            return false;
          }
        }
      }
    }
    // Le contenu utilisateur correspond au schéma
    return true;
  } catch (error) {
    console.error('Error validating content:', error);
    return false;
  }
}