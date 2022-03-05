import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  timestamptz: any;
};

/** Boolean expression to compare columns of type "Float". All fields are combined with logical 'AND'. */
export type Float_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Float']>;
  _gt?: InputMaybe<Scalars['Float']>;
  _gte?: InputMaybe<Scalars['Float']>;
  _in?: InputMaybe<Array<Scalars['Float']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Float']>;
  _lte?: InputMaybe<Scalars['Float']>;
  _neq?: InputMaybe<Scalars['Float']>;
  _nin?: InputMaybe<Array<Scalars['Float']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/**
 * Spot Type を分類するためのカテゴリー
 *
 *
 * columns and relationships of "categories"
 *
 */
export type Categories = {
  __typename?: 'categories';
  /** An array relationship */
  category_types: Array<Category_Type>;
  created_at: Scalars['timestamptz'];
  id: Scalars['Int'];
  name: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/**
 * Spot Type を分類するためのカテゴリー
 *
 *
 * columns and relationships of "categories"
 *
 */
export type CategoriesCategory_TypesArgs = {
  distinct_on?: InputMaybe<Array<Category_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Category_Type_Order_By>>;
  where?: InputMaybe<Category_Type_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "categories". All fields are combined with a logical 'AND'. */
export type Categories_Bool_Exp = {
  _and?: InputMaybe<Array<Categories_Bool_Exp>>;
  _not?: InputMaybe<Categories_Bool_Exp>;
  _or?: InputMaybe<Array<Categories_Bool_Exp>>;
  category_types?: InputMaybe<Category_Type_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "categories" */
export enum Categories_Constraint {
  /** unique or primary key constraint */
  CategoriesPkey = 'categories_pkey'
}

/** input type for inserting data into table "categories" */
export type Categories_Insert_Input = {
  category_types?: InputMaybe<Category_Type_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
};

/** response of any mutation on the table "categories" */
export type Categories_Mutation_Response = {
  __typename?: 'categories_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Categories>;
};

/** input type for inserting object relation for remote table "categories" */
export type Categories_Obj_Rel_Insert_Input = {
  data: Categories_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Categories_On_Conflict>;
};

/** on_conflict condition type for table "categories" */
export type Categories_On_Conflict = {
  constraint: Categories_Constraint;
  update_columns?: Array<Categories_Update_Column>;
  where?: InputMaybe<Categories_Bool_Exp>;
};

/** Ordering options when selecting data from "categories". */
export type Categories_Order_By = {
  category_types_aggregate?: InputMaybe<Category_Type_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: categories */
export type Categories_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "categories" */
export enum Categories_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "categories" */
export type Categories_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "categories" */
export enum Categories_Update_Column {
  /** column name */
  Name = 'name'
}

/**
 * Category - Type 間の中間テーブル
 *
 *
 * columns and relationships of "category_type"
 *
 */
export type Category_Type = {
  __typename?: 'category_type';
  /** An object relationship */
  category: Categories;
  category_id: Scalars['Int'];
  /** An object relationship */
  type: Types;
  type_id: Scalars['Int'];
};

/** order by aggregate values of table "category_type" */
export type Category_Type_Aggregate_Order_By = {
  avg?: InputMaybe<Category_Type_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Category_Type_Max_Order_By>;
  min?: InputMaybe<Category_Type_Min_Order_By>;
  stddev?: InputMaybe<Category_Type_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Category_Type_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Category_Type_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Category_Type_Sum_Order_By>;
  var_pop?: InputMaybe<Category_Type_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Category_Type_Var_Samp_Order_By>;
  variance?: InputMaybe<Category_Type_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "category_type" */
export type Category_Type_Arr_Rel_Insert_Input = {
  data: Array<Category_Type_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Category_Type_On_Conflict>;
};

/** order by avg() on columns of table "category_type" */
export type Category_Type_Avg_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "category_type". All fields are combined with a logical 'AND'. */
export type Category_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Category_Type_Bool_Exp>>;
  _not?: InputMaybe<Category_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Category_Type_Bool_Exp>>;
  category?: InputMaybe<Categories_Bool_Exp>;
  category_id?: InputMaybe<Int_Comparison_Exp>;
  type?: InputMaybe<Types_Bool_Exp>;
  type_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "category_type" */
export enum Category_Type_Constraint {
  /** unique or primary key constraint */
  CategoryTypePkey = 'category_type_pkey'
}

/** input type for incrementing numeric columns in table "category_type" */
export type Category_Type_Inc_Input = {
  category_id?: InputMaybe<Scalars['Int']>;
  type_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "category_type" */
export type Category_Type_Insert_Input = {
  category?: InputMaybe<Categories_Obj_Rel_Insert_Input>;
  category_id?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Types_Obj_Rel_Insert_Input>;
  type_id?: InputMaybe<Scalars['Int']>;
};

/** order by max() on columns of table "category_type" */
export type Category_Type_Max_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "category_type" */
export type Category_Type_Min_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "category_type" */
export type Category_Type_Mutation_Response = {
  __typename?: 'category_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Category_Type>;
};

/** on_conflict condition type for table "category_type" */
export type Category_Type_On_Conflict = {
  constraint: Category_Type_Constraint;
  update_columns?: Array<Category_Type_Update_Column>;
  where?: InputMaybe<Category_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "category_type". */
export type Category_Type_Order_By = {
  category?: InputMaybe<Categories_Order_By>;
  category_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Types_Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: category_type */
export type Category_Type_Pk_Columns_Input = {
  category_id: Scalars['Int'];
  type_id: Scalars['Int'];
};

/** select columns of table "category_type" */
export enum Category_Type_Select_Column {
  /** column name */
  CategoryId = 'category_id',
  /** column name */
  TypeId = 'type_id'
}

/** input type for updating data in table "category_type" */
export type Category_Type_Set_Input = {
  category_id?: InputMaybe<Scalars['Int']>;
  type_id?: InputMaybe<Scalars['Int']>;
};

/** order by stddev() on columns of table "category_type" */
export type Category_Type_Stddev_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "category_type" */
export type Category_Type_Stddev_Pop_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "category_type" */
export type Category_Type_Stddev_Samp_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** order by sum() on columns of table "category_type" */
export type Category_Type_Sum_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** update columns of table "category_type" */
export enum Category_Type_Update_Column {
  /** column name */
  CategoryId = 'category_id',
  /** column name */
  TypeId = 'type_id'
}

/** order by var_pop() on columns of table "category_type" */
export type Category_Type_Var_Pop_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "category_type" */
export type Category_Type_Var_Samp_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "category_type" */
export type Category_Type_Variance_Order_By = {
  category_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "categories" */
  delete_categories?: Maybe<Categories_Mutation_Response>;
  /** delete single row from the table: "categories" */
  delete_categories_by_pk?: Maybe<Categories>;
  /** delete data from the table: "category_type" */
  delete_category_type?: Maybe<Category_Type_Mutation_Response>;
  /** delete single row from the table: "category_type" */
  delete_category_type_by_pk?: Maybe<Category_Type>;
  /** delete data from the table: "prefectures" */
  delete_prefectures?: Maybe<Prefectures_Mutation_Response>;
  /** delete single row from the table: "prefectures" */
  delete_prefectures_by_pk?: Maybe<Prefectures>;
  /** delete data from the table: "spot_type" */
  delete_spot_type?: Maybe<Spot_Type_Mutation_Response>;
  /** delete single row from the table: "spot_type" */
  delete_spot_type_by_pk?: Maybe<Spot_Type>;
  /** delete data from the table: "spots" */
  delete_spots?: Maybe<Spots_Mutation_Response>;
  /** delete single row from the table: "spots" */
  delete_spots_by_pk?: Maybe<Spots>;
  /** delete data from the table: "types" */
  delete_types?: Maybe<Types_Mutation_Response>;
  /** delete single row from the table: "types" */
  delete_types_by_pk?: Maybe<Types>;
  /** insert data into the table: "categories" */
  insert_categories?: Maybe<Categories_Mutation_Response>;
  /** insert a single row into the table: "categories" */
  insert_categories_one?: Maybe<Categories>;
  /** insert data into the table: "category_type" */
  insert_category_type?: Maybe<Category_Type_Mutation_Response>;
  /** insert a single row into the table: "category_type" */
  insert_category_type_one?: Maybe<Category_Type>;
  /** insert data into the table: "prefectures" */
  insert_prefectures?: Maybe<Prefectures_Mutation_Response>;
  /** insert a single row into the table: "prefectures" */
  insert_prefectures_one?: Maybe<Prefectures>;
  /** insert data into the table: "spot_type" */
  insert_spot_type?: Maybe<Spot_Type_Mutation_Response>;
  /** insert a single row into the table: "spot_type" */
  insert_spot_type_one?: Maybe<Spot_Type>;
  /** insert data into the table: "spots" */
  insert_spots?: Maybe<Spots_Mutation_Response>;
  /** insert a single row into the table: "spots" */
  insert_spots_one?: Maybe<Spots>;
  /** insert data into the table: "types" */
  insert_types?: Maybe<Types_Mutation_Response>;
  /** insert a single row into the table: "types" */
  insert_types_one?: Maybe<Types>;
  /** update data of the table: "categories" */
  update_categories?: Maybe<Categories_Mutation_Response>;
  /** update single row of the table: "categories" */
  update_categories_by_pk?: Maybe<Categories>;
  /** update data of the table: "category_type" */
  update_category_type?: Maybe<Category_Type_Mutation_Response>;
  /** update single row of the table: "category_type" */
  update_category_type_by_pk?: Maybe<Category_Type>;
  /** update data of the table: "prefectures" */
  update_prefectures?: Maybe<Prefectures_Mutation_Response>;
  /** update single row of the table: "prefectures" */
  update_prefectures_by_pk?: Maybe<Prefectures>;
  /** update data of the table: "spot_type" */
  update_spot_type?: Maybe<Spot_Type_Mutation_Response>;
  /** update single row of the table: "spot_type" */
  update_spot_type_by_pk?: Maybe<Spot_Type>;
  /** update data of the table: "spots" */
  update_spots?: Maybe<Spots_Mutation_Response>;
  /** update single row of the table: "spots" */
  update_spots_by_pk?: Maybe<Spots>;
  /** update data of the table: "types" */
  update_types?: Maybe<Types_Mutation_Response>;
  /** update single row of the table: "types" */
  update_types_by_pk?: Maybe<Types>;
};


/** mutation root */
export type Mutation_RootDelete_CategoriesArgs = {
  where: Categories_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Categories_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Category_TypeArgs = {
  where: Category_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Category_Type_By_PkArgs = {
  category_id: Scalars['Int'];
  type_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_PrefecturesArgs = {
  where: Prefectures_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Prefectures_By_PkArgs = {
  code: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Spot_TypeArgs = {
  where: Spot_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Spot_Type_By_PkArgs = {
  spot_id: Scalars['String'];
  type_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_SpotsArgs = {
  where: Spots_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Spots_By_PkArgs = {
  place_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_TypesArgs = {
  where: Types_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Types_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootInsert_CategoriesArgs = {
  objects: Array<Categories_Insert_Input>;
  on_conflict?: InputMaybe<Categories_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Categories_OneArgs = {
  object: Categories_Insert_Input;
  on_conflict?: InputMaybe<Categories_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Category_TypeArgs = {
  objects: Array<Category_Type_Insert_Input>;
  on_conflict?: InputMaybe<Category_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Category_Type_OneArgs = {
  object: Category_Type_Insert_Input;
  on_conflict?: InputMaybe<Category_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PrefecturesArgs = {
  objects: Array<Prefectures_Insert_Input>;
  on_conflict?: InputMaybe<Prefectures_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Prefectures_OneArgs = {
  object: Prefectures_Insert_Input;
  on_conflict?: InputMaybe<Prefectures_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Spot_TypeArgs = {
  objects: Array<Spot_Type_Insert_Input>;
  on_conflict?: InputMaybe<Spot_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Spot_Type_OneArgs = {
  object: Spot_Type_Insert_Input;
  on_conflict?: InputMaybe<Spot_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_SpotsArgs = {
  objects: Array<Spots_Insert_Input>;
  on_conflict?: InputMaybe<Spots_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Spots_OneArgs = {
  object: Spots_Insert_Input;
  on_conflict?: InputMaybe<Spots_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TypesArgs = {
  objects: Array<Types_Insert_Input>;
  on_conflict?: InputMaybe<Types_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Types_OneArgs = {
  object: Types_Insert_Input;
  on_conflict?: InputMaybe<Types_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_CategoriesArgs = {
  _set?: InputMaybe<Categories_Set_Input>;
  where: Categories_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Categories_By_PkArgs = {
  _set?: InputMaybe<Categories_Set_Input>;
  pk_columns: Categories_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Category_TypeArgs = {
  _inc?: InputMaybe<Category_Type_Inc_Input>;
  _set?: InputMaybe<Category_Type_Set_Input>;
  where: Category_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Category_Type_By_PkArgs = {
  _inc?: InputMaybe<Category_Type_Inc_Input>;
  _set?: InputMaybe<Category_Type_Set_Input>;
  pk_columns: Category_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_PrefecturesArgs = {
  _inc?: InputMaybe<Prefectures_Inc_Input>;
  _set?: InputMaybe<Prefectures_Set_Input>;
  where: Prefectures_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Prefectures_By_PkArgs = {
  _inc?: InputMaybe<Prefectures_Inc_Input>;
  _set?: InputMaybe<Prefectures_Set_Input>;
  pk_columns: Prefectures_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Spot_TypeArgs = {
  _inc?: InputMaybe<Spot_Type_Inc_Input>;
  _set?: InputMaybe<Spot_Type_Set_Input>;
  where: Spot_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Spot_Type_By_PkArgs = {
  _inc?: InputMaybe<Spot_Type_Inc_Input>;
  _set?: InputMaybe<Spot_Type_Set_Input>;
  pk_columns: Spot_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_SpotsArgs = {
  _inc?: InputMaybe<Spots_Inc_Input>;
  _set?: InputMaybe<Spots_Set_Input>;
  where: Spots_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Spots_By_PkArgs = {
  _inc?: InputMaybe<Spots_Inc_Input>;
  _set?: InputMaybe<Spots_Set_Input>;
  pk_columns: Spots_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_TypesArgs = {
  _set?: InputMaybe<Types_Set_Input>;
  where: Types_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Types_By_PkArgs = {
  _set?: InputMaybe<Types_Set_Input>;
  pk_columns: Types_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/**
 * 都道府県の一覧
 *
 *
 * columns and relationships of "prefectures"
 *
 */
export type Prefectures = {
  __typename?: 'prefectures';
  code: Scalars['Int'];
  created_at?: Maybe<Scalars['timestamptz']>;
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  name: Scalars['String'];
  place_id: Scalars['String'];
  /** An array relationship */
  spots: Array<Spots>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  zoom: Scalars['Int'];
};


/**
 * 都道府県の一覧
 *
 *
 * columns and relationships of "prefectures"
 *
 */
export type PrefecturesSpotsArgs = {
  distinct_on?: InputMaybe<Array<Spots_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Spots_Order_By>>;
  where?: InputMaybe<Spots_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "prefectures". All fields are combined with a logical 'AND'. */
export type Prefectures_Bool_Exp = {
  _and?: InputMaybe<Array<Prefectures_Bool_Exp>>;
  _not?: InputMaybe<Prefectures_Bool_Exp>;
  _or?: InputMaybe<Array<Prefectures_Bool_Exp>>;
  code?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  lat?: InputMaybe<Float_Comparison_Exp>;
  lng?: InputMaybe<Float_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  place_id?: InputMaybe<String_Comparison_Exp>;
  spots?: InputMaybe<Spots_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  zoom?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "prefectures" */
export enum Prefectures_Constraint {
  /** unique or primary key constraint */
  PrefecturesNameKey = 'prefectures_name_key',
  /** unique or primary key constraint */
  PrefecturesPkey = 'prefectures_pkey',
  /** unique or primary key constraint */
  PrefecturesPlaceIdKey = 'prefectures_place_id_key'
}

/** input type for incrementing numeric columns in table "prefectures" */
export type Prefectures_Inc_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  zoom?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "prefectures" */
export type Prefectures_Insert_Input = {
  code?: InputMaybe<Scalars['Int']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  place_id?: InputMaybe<Scalars['String']>;
  spots?: InputMaybe<Spots_Arr_Rel_Insert_Input>;
  zoom?: InputMaybe<Scalars['Int']>;
};

/** response of any mutation on the table "prefectures" */
export type Prefectures_Mutation_Response = {
  __typename?: 'prefectures_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Prefectures>;
};

/** input type for inserting object relation for remote table "prefectures" */
export type Prefectures_Obj_Rel_Insert_Input = {
  data: Prefectures_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Prefectures_On_Conflict>;
};

/** on_conflict condition type for table "prefectures" */
export type Prefectures_On_Conflict = {
  constraint: Prefectures_Constraint;
  update_columns?: Array<Prefectures_Update_Column>;
  where?: InputMaybe<Prefectures_Bool_Exp>;
};

/** Ordering options when selecting data from "prefectures". */
export type Prefectures_Order_By = {
  code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  place_id?: InputMaybe<Order_By>;
  spots_aggregate?: InputMaybe<Spots_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  zoom?: InputMaybe<Order_By>;
};

/** primary key columns input for table: prefectures */
export type Prefectures_Pk_Columns_Input = {
  code: Scalars['Int'];
};

/** select columns of table "prefectures" */
export enum Prefectures_Select_Column {
  /** column name */
  Code = 'code',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Lat = 'lat',
  /** column name */
  Lng = 'lng',
  /** column name */
  Name = 'name',
  /** column name */
  PlaceId = 'place_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Zoom = 'zoom'
}

/** input type for updating data in table "prefectures" */
export type Prefectures_Set_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  place_id?: InputMaybe<Scalars['String']>;
  zoom?: InputMaybe<Scalars['Int']>;
};

/** update columns of table "prefectures" */
export enum Prefectures_Update_Column {
  /** column name */
  Lat = 'lat',
  /** column name */
  Lng = 'lng',
  /** column name */
  Name = 'name',
  /** column name */
  PlaceId = 'place_id',
  /** column name */
  Zoom = 'zoom'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "categories" */
  categories: Array<Categories>;
  /** fetch data from the table: "categories" using primary key columns */
  categories_by_pk?: Maybe<Categories>;
  /** fetch data from the table: "category_type" */
  category_type: Array<Category_Type>;
  /** fetch data from the table: "category_type" using primary key columns */
  category_type_by_pk?: Maybe<Category_Type>;
  /** fetch data from the table: "prefectures" */
  prefectures: Array<Prefectures>;
  /** fetch data from the table: "prefectures" using primary key columns */
  prefectures_by_pk?: Maybe<Prefectures>;
  /** fetch data from the table: "spot_type" */
  spot_type: Array<Spot_Type>;
  /** fetch data from the table: "spot_type" using primary key columns */
  spot_type_by_pk?: Maybe<Spot_Type>;
  /** An array relationship */
  spots: Array<Spots>;
  /** fetch data from the table: "spots" using primary key columns */
  spots_by_pk?: Maybe<Spots>;
  /** fetch data from the table: "types" */
  types: Array<Types>;
  /** fetch data from the table: "types" using primary key columns */
  types_by_pk?: Maybe<Types>;
};


export type Query_RootCategoriesArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


export type Query_RootCategories_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootCategory_TypeArgs = {
  distinct_on?: InputMaybe<Array<Category_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Category_Type_Order_By>>;
  where?: InputMaybe<Category_Type_Bool_Exp>;
};


export type Query_RootCategory_Type_By_PkArgs = {
  category_id: Scalars['Int'];
  type_id: Scalars['Int'];
};


export type Query_RootPrefecturesArgs = {
  distinct_on?: InputMaybe<Array<Prefectures_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Prefectures_Order_By>>;
  where?: InputMaybe<Prefectures_Bool_Exp>;
};


export type Query_RootPrefectures_By_PkArgs = {
  code: Scalars['Int'];
};


export type Query_RootSpot_TypeArgs = {
  distinct_on?: InputMaybe<Array<Spot_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Spot_Type_Order_By>>;
  where?: InputMaybe<Spot_Type_Bool_Exp>;
};


export type Query_RootSpot_Type_By_PkArgs = {
  spot_id: Scalars['String'];
  type_id: Scalars['Int'];
};


export type Query_RootSpotsArgs = {
  distinct_on?: InputMaybe<Array<Spots_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Spots_Order_By>>;
  where?: InputMaybe<Spots_Bool_Exp>;
};


export type Query_RootSpots_By_PkArgs = {
  place_id: Scalars['String'];
};


export type Query_RootTypesArgs = {
  distinct_on?: InputMaybe<Array<Types_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Types_Order_By>>;
  where?: InputMaybe<Types_Bool_Exp>;
};


export type Query_RootTypes_By_PkArgs = {
  id: Scalars['Int'];
};

/**
 * spots テーブルと types テーブルの中間テーブル
 *
 *
 * columns and relationships of "spot_type"
 *
 */
export type Spot_Type = {
  __typename?: 'spot_type';
  /** An object relationship */
  spot: Spots;
  spot_id: Scalars['String'];
  /** An object relationship */
  type: Types;
  type_id: Scalars['Int'];
};

/** order by aggregate values of table "spot_type" */
export type Spot_Type_Aggregate_Order_By = {
  avg?: InputMaybe<Spot_Type_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Spot_Type_Max_Order_By>;
  min?: InputMaybe<Spot_Type_Min_Order_By>;
  stddev?: InputMaybe<Spot_Type_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Spot_Type_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Spot_Type_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Spot_Type_Sum_Order_By>;
  var_pop?: InputMaybe<Spot_Type_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Spot_Type_Var_Samp_Order_By>;
  variance?: InputMaybe<Spot_Type_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "spot_type" */
export type Spot_Type_Arr_Rel_Insert_Input = {
  data: Array<Spot_Type_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Spot_Type_On_Conflict>;
};

/** order by avg() on columns of table "spot_type" */
export type Spot_Type_Avg_Order_By = {
  type_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "spot_type". All fields are combined with a logical 'AND'. */
export type Spot_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Spot_Type_Bool_Exp>>;
  _not?: InputMaybe<Spot_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Spot_Type_Bool_Exp>>;
  spot?: InputMaybe<Spots_Bool_Exp>;
  spot_id?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<Types_Bool_Exp>;
  type_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "spot_type" */
export enum Spot_Type_Constraint {
  /** unique or primary key constraint */
  SpotsTypesPkey = 'spots_types_pkey'
}

/** input type for incrementing numeric columns in table "spot_type" */
export type Spot_Type_Inc_Input = {
  type_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "spot_type" */
export type Spot_Type_Insert_Input = {
  spot?: InputMaybe<Spots_Obj_Rel_Insert_Input>;
  spot_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Types_Obj_Rel_Insert_Input>;
  type_id?: InputMaybe<Scalars['Int']>;
};

/** order by max() on columns of table "spot_type" */
export type Spot_Type_Max_Order_By = {
  spot_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "spot_type" */
export type Spot_Type_Min_Order_By = {
  spot_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "spot_type" */
export type Spot_Type_Mutation_Response = {
  __typename?: 'spot_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Spot_Type>;
};

/** on_conflict condition type for table "spot_type" */
export type Spot_Type_On_Conflict = {
  constraint: Spot_Type_Constraint;
  update_columns?: Array<Spot_Type_Update_Column>;
  where?: InputMaybe<Spot_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "spot_type". */
export type Spot_Type_Order_By = {
  spot?: InputMaybe<Spots_Order_By>;
  spot_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Types_Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: spot_type */
export type Spot_Type_Pk_Columns_Input = {
  spot_id: Scalars['String'];
  type_id: Scalars['Int'];
};

/** select columns of table "spot_type" */
export enum Spot_Type_Select_Column {
  /** column name */
  SpotId = 'spot_id',
  /** column name */
  TypeId = 'type_id'
}

/** input type for updating data in table "spot_type" */
export type Spot_Type_Set_Input = {
  spot_id?: InputMaybe<Scalars['String']>;
  type_id?: InputMaybe<Scalars['Int']>;
};

/** order by stddev() on columns of table "spot_type" */
export type Spot_Type_Stddev_Order_By = {
  type_id?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "spot_type" */
export type Spot_Type_Stddev_Pop_Order_By = {
  type_id?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "spot_type" */
export type Spot_Type_Stddev_Samp_Order_By = {
  type_id?: InputMaybe<Order_By>;
};

/** order by sum() on columns of table "spot_type" */
export type Spot_Type_Sum_Order_By = {
  type_id?: InputMaybe<Order_By>;
};

/** update columns of table "spot_type" */
export enum Spot_Type_Update_Column {
  /** column name */
  SpotId = 'spot_id',
  /** column name */
  TypeId = 'type_id'
}

/** order by var_pop() on columns of table "spot_type" */
export type Spot_Type_Var_Pop_Order_By = {
  type_id?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "spot_type" */
export type Spot_Type_Var_Samp_Order_By = {
  type_id?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "spot_type" */
export type Spot_Type_Variance_Order_By = {
  type_id?: InputMaybe<Order_By>;
};

/**
 * マーカーとして表示する観光スポット
 *
 *
 * columns and relationships of "spots"
 *
 */
export type Spots = {
  __typename?: 'spots';
  created_at: Scalars['timestamptz'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  name: Scalars['String'];
  place_id: Scalars['String'];
  /** An object relationship */
  prefecture: Prefectures;
  prefecture_code: Scalars['Int'];
  /** An array relationship */
  spots_types: Array<Spot_Type>;
  updated_at: Scalars['timestamptz'];
};


/**
 * マーカーとして表示する観光スポット
 *
 *
 * columns and relationships of "spots"
 *
 */
export type SpotsSpots_TypesArgs = {
  distinct_on?: InputMaybe<Array<Spot_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Spot_Type_Order_By>>;
  where?: InputMaybe<Spot_Type_Bool_Exp>;
};

/** order by aggregate values of table "spots" */
export type Spots_Aggregate_Order_By = {
  avg?: InputMaybe<Spots_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Spots_Max_Order_By>;
  min?: InputMaybe<Spots_Min_Order_By>;
  stddev?: InputMaybe<Spots_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Spots_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Spots_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Spots_Sum_Order_By>;
  var_pop?: InputMaybe<Spots_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Spots_Var_Samp_Order_By>;
  variance?: InputMaybe<Spots_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "spots" */
export type Spots_Arr_Rel_Insert_Input = {
  data: Array<Spots_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Spots_On_Conflict>;
};

/** order by avg() on columns of table "spots" */
export type Spots_Avg_Order_By = {
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "spots". All fields are combined with a logical 'AND'. */
export type Spots_Bool_Exp = {
  _and?: InputMaybe<Array<Spots_Bool_Exp>>;
  _not?: InputMaybe<Spots_Bool_Exp>;
  _or?: InputMaybe<Array<Spots_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  lat?: InputMaybe<Float_Comparison_Exp>;
  lng?: InputMaybe<Float_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  place_id?: InputMaybe<String_Comparison_Exp>;
  prefecture?: InputMaybe<Prefectures_Bool_Exp>;
  prefecture_code?: InputMaybe<Int_Comparison_Exp>;
  spots_types?: InputMaybe<Spot_Type_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "spots" */
export enum Spots_Constraint {
  /** unique or primary key constraint */
  SpotsPkey = 'spots_pkey'
}

/** input type for incrementing numeric columns in table "spots" */
export type Spots_Inc_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  prefecture_code?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "spots" */
export type Spots_Insert_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  place_id?: InputMaybe<Scalars['String']>;
  prefecture?: InputMaybe<Prefectures_Obj_Rel_Insert_Input>;
  prefecture_code?: InputMaybe<Scalars['Int']>;
  spots_types?: InputMaybe<Spot_Type_Arr_Rel_Insert_Input>;
};

/** order by max() on columns of table "spots" */
export type Spots_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  place_id?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "spots" */
export type Spots_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  place_id?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "spots" */
export type Spots_Mutation_Response = {
  __typename?: 'spots_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Spots>;
};

/** input type for inserting object relation for remote table "spots" */
export type Spots_Obj_Rel_Insert_Input = {
  data: Spots_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Spots_On_Conflict>;
};

/** on_conflict condition type for table "spots" */
export type Spots_On_Conflict = {
  constraint: Spots_Constraint;
  update_columns?: Array<Spots_Update_Column>;
  where?: InputMaybe<Spots_Bool_Exp>;
};

/** Ordering options when selecting data from "spots". */
export type Spots_Order_By = {
  created_at?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  place_id?: InputMaybe<Order_By>;
  prefecture?: InputMaybe<Prefectures_Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
  spots_types_aggregate?: InputMaybe<Spot_Type_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: spots */
export type Spots_Pk_Columns_Input = {
  place_id: Scalars['String'];
};

/** select columns of table "spots" */
export enum Spots_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Lat = 'lat',
  /** column name */
  Lng = 'lng',
  /** column name */
  Name = 'name',
  /** column name */
  PlaceId = 'place_id',
  /** column name */
  PrefectureCode = 'prefecture_code',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "spots" */
export type Spots_Set_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  prefecture_code?: InputMaybe<Scalars['Int']>;
};

/** order by stddev() on columns of table "spots" */
export type Spots_Stddev_Order_By = {
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "spots" */
export type Spots_Stddev_Pop_Order_By = {
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "spots" */
export type Spots_Stddev_Samp_Order_By = {
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by sum() on columns of table "spots" */
export type Spots_Sum_Order_By = {
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** update columns of table "spots" */
export enum Spots_Update_Column {
  /** column name */
  Lat = 'lat',
  /** column name */
  Lng = 'lng',
  /** column name */
  Name = 'name',
  /** column name */
  PrefectureCode = 'prefecture_code'
}

/** order by var_pop() on columns of table "spots" */
export type Spots_Var_Pop_Order_By = {
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "spots" */
export type Spots_Var_Samp_Order_By = {
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "spots" */
export type Spots_Variance_Order_By = {
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "categories" */
  categories: Array<Categories>;
  /** fetch data from the table: "categories" using primary key columns */
  categories_by_pk?: Maybe<Categories>;
  /** fetch data from the table: "category_type" */
  category_type: Array<Category_Type>;
  /** fetch data from the table: "category_type" using primary key columns */
  category_type_by_pk?: Maybe<Category_Type>;
  /** fetch data from the table: "prefectures" */
  prefectures: Array<Prefectures>;
  /** fetch data from the table: "prefectures" using primary key columns */
  prefectures_by_pk?: Maybe<Prefectures>;
  /** fetch data from the table: "spot_type" */
  spot_type: Array<Spot_Type>;
  /** fetch data from the table: "spot_type" using primary key columns */
  spot_type_by_pk?: Maybe<Spot_Type>;
  /** An array relationship */
  spots: Array<Spots>;
  /** fetch data from the table: "spots" using primary key columns */
  spots_by_pk?: Maybe<Spots>;
  /** fetch data from the table: "types" */
  types: Array<Types>;
  /** fetch data from the table: "types" using primary key columns */
  types_by_pk?: Maybe<Types>;
};


export type Subscription_RootCategoriesArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


export type Subscription_RootCategories_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootCategory_TypeArgs = {
  distinct_on?: InputMaybe<Array<Category_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Category_Type_Order_By>>;
  where?: InputMaybe<Category_Type_Bool_Exp>;
};


export type Subscription_RootCategory_Type_By_PkArgs = {
  category_id: Scalars['Int'];
  type_id: Scalars['Int'];
};


export type Subscription_RootPrefecturesArgs = {
  distinct_on?: InputMaybe<Array<Prefectures_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Prefectures_Order_By>>;
  where?: InputMaybe<Prefectures_Bool_Exp>;
};


export type Subscription_RootPrefectures_By_PkArgs = {
  code: Scalars['Int'];
};


export type Subscription_RootSpot_TypeArgs = {
  distinct_on?: InputMaybe<Array<Spot_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Spot_Type_Order_By>>;
  where?: InputMaybe<Spot_Type_Bool_Exp>;
};


export type Subscription_RootSpot_Type_By_PkArgs = {
  spot_id: Scalars['String'];
  type_id: Scalars['Int'];
};


export type Subscription_RootSpotsArgs = {
  distinct_on?: InputMaybe<Array<Spots_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Spots_Order_By>>;
  where?: InputMaybe<Spots_Bool_Exp>;
};


export type Subscription_RootSpots_By_PkArgs = {
  place_id: Scalars['String'];
};


export type Subscription_RootTypesArgs = {
  distinct_on?: InputMaybe<Array<Types_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Types_Order_By>>;
  where?: InputMaybe<Types_Bool_Exp>;
};


export type Subscription_RootTypes_By_PkArgs = {
  id: Scalars['Int'];
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/**
 * Spot のタイプを定義
 *
 *
 * columns and relationships of "types"
 *
 */
export type Types = {
  __typename?: 'types';
  /** An array relationship */
  category_types: Array<Category_Type>;
  created_at: Scalars['timestamptz'];
  id: Scalars['Int'];
  name: Scalars['String'];
  /** An array relationship */
  spots_types: Array<Spot_Type>;
  updated_at: Scalars['timestamptz'];
};


/**
 * Spot のタイプを定義
 *
 *
 * columns and relationships of "types"
 *
 */
export type TypesCategory_TypesArgs = {
  distinct_on?: InputMaybe<Array<Category_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Category_Type_Order_By>>;
  where?: InputMaybe<Category_Type_Bool_Exp>;
};


/**
 * Spot のタイプを定義
 *
 *
 * columns and relationships of "types"
 *
 */
export type TypesSpots_TypesArgs = {
  distinct_on?: InputMaybe<Array<Spot_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Spot_Type_Order_By>>;
  where?: InputMaybe<Spot_Type_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "types". All fields are combined with a logical 'AND'. */
export type Types_Bool_Exp = {
  _and?: InputMaybe<Array<Types_Bool_Exp>>;
  _not?: InputMaybe<Types_Bool_Exp>;
  _or?: InputMaybe<Array<Types_Bool_Exp>>;
  category_types?: InputMaybe<Category_Type_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  spots_types?: InputMaybe<Spot_Type_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "types" */
export enum Types_Constraint {
  /** unique or primary key constraint */
  SpotTypesNameKey = 'spot_types_name_key',
  /** unique or primary key constraint */
  SpotTypesPkey = 'spot_types_pkey'
}

/** input type for inserting data into table "types" */
export type Types_Insert_Input = {
  category_types?: InputMaybe<Category_Type_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
  spots_types?: InputMaybe<Spot_Type_Arr_Rel_Insert_Input>;
};

/** response of any mutation on the table "types" */
export type Types_Mutation_Response = {
  __typename?: 'types_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Types>;
};

/** input type for inserting object relation for remote table "types" */
export type Types_Obj_Rel_Insert_Input = {
  data: Types_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Types_On_Conflict>;
};

/** on_conflict condition type for table "types" */
export type Types_On_Conflict = {
  constraint: Types_Constraint;
  update_columns?: Array<Types_Update_Column>;
  where?: InputMaybe<Types_Bool_Exp>;
};

/** Ordering options when selecting data from "types". */
export type Types_Order_By = {
  category_types_aggregate?: InputMaybe<Category_Type_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  spots_types_aggregate?: InputMaybe<Spot_Type_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: types */
export type Types_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "types" */
export enum Types_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "types" */
export type Types_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "types" */
export enum Types_Update_Column {
  /** column name */
  Name = 'name'
}

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'query_root', categories: Array<{ __typename?: 'categories', id: number, name: string }> };

export type GetPrefecturesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPrefecturesQuery = { __typename?: 'query_root', prefectures: Array<{ __typename?: 'prefectures', code: number, name: string, lat: number, lng: number, zoom: number, place_id: string }> };

export type GetSpotsByCategoryQueryVariables = Exact<{
  categoryId: Scalars['Int'];
  north: Scalars['Float'];
  south: Scalars['Float'];
  west: Scalars['Float'];
  east: Scalars['Float'];
}>;


export type GetSpotsByCategoryQuery = { __typename?: 'query_root', spots: Array<{ __typename?: 'spots', name: string, lat: number, lng: number, place_id: string }> };

export type GetSpotByPkQueryVariables = Exact<{
  place_id: Scalars['String'];
}>;


export type GetSpotByPkQuery = { __typename?: 'query_root', spots_by_pk?: { __typename?: 'spots', name: string, lng: number, lat: number, place_id: string, prefecture: { __typename?: 'prefectures', name: string }, spots_types: Array<{ __typename?: 'spot_type', type: { __typename?: 'types', category_types: Array<{ __typename?: 'category_type', category: { __typename?: 'categories', name: string } }> } }> } | null };

export type GetSpotsWithMatchingNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetSpotsWithMatchingNameQuery = { __typename?: 'query_root', spots: Array<{ __typename?: 'spots', name: string, place_id: string }> };

export type GetTypesByCategoryQueryVariables = Exact<{
  category_id: Scalars['Int'];
}>;


export type GetTypesByCategoryQuery = { __typename?: 'query_root', category_type: Array<{ __typename?: 'category_type', type: { __typename?: 'types', name: string } }> };


export const GetCategoriesDocument = gql`
    query GetCategories {
  categories {
    id
    name
  }
}
    `;

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
      }
export function useGetCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetPrefecturesDocument = gql`
    query getPrefectures {
  prefectures {
    code
    name
    lat
    lng
    zoom
    place_id
  }
}
    `;

/**
 * __useGetPrefecturesQuery__
 *
 * To run a query within a React component, call `useGetPrefecturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPrefecturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPrefecturesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPrefecturesQuery(baseOptions?: Apollo.QueryHookOptions<GetPrefecturesQuery, GetPrefecturesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPrefecturesQuery, GetPrefecturesQueryVariables>(GetPrefecturesDocument, options);
      }
export function useGetPrefecturesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPrefecturesQuery, GetPrefecturesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPrefecturesQuery, GetPrefecturesQueryVariables>(GetPrefecturesDocument, options);
        }
export type GetPrefecturesQueryHookResult = ReturnType<typeof useGetPrefecturesQuery>;
export type GetPrefecturesLazyQueryHookResult = ReturnType<typeof useGetPrefecturesLazyQuery>;
export type GetPrefecturesQueryResult = Apollo.QueryResult<GetPrefecturesQuery, GetPrefecturesQueryVariables>;
export const GetSpotsByCategoryDocument = gql`
    query GetSpotsByCategory($categoryId: Int!, $north: Float!, $south: Float!, $west: Float!, $east: Float!) {
  spots(
    where: {spots_types: {type: {category_types: {category_id: {_eq: $categoryId}}}, spot: {lat: {_gt: $south, _lt: $north}, lng: {_gt: $west, _lt: $east}}}}
  ) {
    name
    lat
    lng
    place_id
  }
}
    `;

/**
 * __useGetSpotsByCategoryQuery__
 *
 * To run a query within a React component, call `useGetSpotsByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpotsByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpotsByCategoryQuery({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *      north: // value for 'north'
 *      south: // value for 'south'
 *      west: // value for 'west'
 *      east: // value for 'east'
 *   },
 * });
 */
export function useGetSpotsByCategoryQuery(baseOptions: Apollo.QueryHookOptions<GetSpotsByCategoryQuery, GetSpotsByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSpotsByCategoryQuery, GetSpotsByCategoryQueryVariables>(GetSpotsByCategoryDocument, options);
      }
export function useGetSpotsByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSpotsByCategoryQuery, GetSpotsByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSpotsByCategoryQuery, GetSpotsByCategoryQueryVariables>(GetSpotsByCategoryDocument, options);
        }
export type GetSpotsByCategoryQueryHookResult = ReturnType<typeof useGetSpotsByCategoryQuery>;
export type GetSpotsByCategoryLazyQueryHookResult = ReturnType<typeof useGetSpotsByCategoryLazyQuery>;
export type GetSpotsByCategoryQueryResult = Apollo.QueryResult<GetSpotsByCategoryQuery, GetSpotsByCategoryQueryVariables>;
export const GetSpotByPkDocument = gql`
    query GetSpotByPk($place_id: String!) {
  spots_by_pk(place_id: $place_id) {
    name
    lng
    lat
    place_id
    prefecture {
      name
    }
    spots_types {
      type {
        category_types {
          category {
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetSpotByPkQuery__
 *
 * To run a query within a React component, call `useGetSpotByPkQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpotByPkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpotByPkQuery({
 *   variables: {
 *      place_id: // value for 'place_id'
 *   },
 * });
 */
export function useGetSpotByPkQuery(baseOptions: Apollo.QueryHookOptions<GetSpotByPkQuery, GetSpotByPkQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSpotByPkQuery, GetSpotByPkQueryVariables>(GetSpotByPkDocument, options);
      }
export function useGetSpotByPkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSpotByPkQuery, GetSpotByPkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSpotByPkQuery, GetSpotByPkQueryVariables>(GetSpotByPkDocument, options);
        }
export type GetSpotByPkQueryHookResult = ReturnType<typeof useGetSpotByPkQuery>;
export type GetSpotByPkLazyQueryHookResult = ReturnType<typeof useGetSpotByPkLazyQuery>;
export type GetSpotByPkQueryResult = Apollo.QueryResult<GetSpotByPkQuery, GetSpotByPkQueryVariables>;
export const GetSpotsWithMatchingNameDocument = gql`
    query GetSpotsWithMatchingName($name: String!) {
  spots(limit: 10, where: {name: {_regex: $name}}) {
    name
    place_id
  }
}
    `;

/**
 * __useGetSpotsWithMatchingNameQuery__
 *
 * To run a query within a React component, call `useGetSpotsWithMatchingNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpotsWithMatchingNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpotsWithMatchingNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetSpotsWithMatchingNameQuery(baseOptions: Apollo.QueryHookOptions<GetSpotsWithMatchingNameQuery, GetSpotsWithMatchingNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSpotsWithMatchingNameQuery, GetSpotsWithMatchingNameQueryVariables>(GetSpotsWithMatchingNameDocument, options);
      }
export function useGetSpotsWithMatchingNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSpotsWithMatchingNameQuery, GetSpotsWithMatchingNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSpotsWithMatchingNameQuery, GetSpotsWithMatchingNameQueryVariables>(GetSpotsWithMatchingNameDocument, options);
        }
export type GetSpotsWithMatchingNameQueryHookResult = ReturnType<typeof useGetSpotsWithMatchingNameQuery>;
export type GetSpotsWithMatchingNameLazyQueryHookResult = ReturnType<typeof useGetSpotsWithMatchingNameLazyQuery>;
export type GetSpotsWithMatchingNameQueryResult = Apollo.QueryResult<GetSpotsWithMatchingNameQuery, GetSpotsWithMatchingNameQueryVariables>;
export const GetTypesByCategoryDocument = gql`
    query GetTypesByCategory($category_id: Int!) {
  category_type(where: {category_id: {_eq: $category_id}}) {
    type {
      name
    }
  }
}
    `;

/**
 * __useGetTypesByCategoryQuery__
 *
 * To run a query within a React component, call `useGetTypesByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTypesByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTypesByCategoryQuery({
 *   variables: {
 *      category_id: // value for 'category_id'
 *   },
 * });
 */
export function useGetTypesByCategoryQuery(baseOptions: Apollo.QueryHookOptions<GetTypesByCategoryQuery, GetTypesByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTypesByCategoryQuery, GetTypesByCategoryQueryVariables>(GetTypesByCategoryDocument, options);
      }
export function useGetTypesByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTypesByCategoryQuery, GetTypesByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTypesByCategoryQuery, GetTypesByCategoryQueryVariables>(GetTypesByCategoryDocument, options);
        }
export type GetTypesByCategoryQueryHookResult = ReturnType<typeof useGetTypesByCategoryQuery>;
export type GetTypesByCategoryLazyQueryHookResult = ReturnType<typeof useGetTypesByCategoryLazyQuery>;
export type GetTypesByCategoryQueryResult = Apollo.QueryResult<GetTypesByCategoryQuery, GetTypesByCategoryQueryVariables>;