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
 * マーカーとして表示する市町村
 *
 *
 * columns and relationships of "cities"
 *
 */
export type Cities = {
  __typename?: 'cities';
  created_at?: Maybe<Scalars['timestamptz']>;
  id: Scalars['Int'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  name: Scalars['String'];
  prefecture_code: Scalars['Int'];
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by aggregate values of table "cities" */
export type Cities_Aggregate_Order_By = {
  avg?: InputMaybe<Cities_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cities_Max_Order_By>;
  min?: InputMaybe<Cities_Min_Order_By>;
  stddev?: InputMaybe<Cities_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Cities_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Cities_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Cities_Sum_Order_By>;
  var_pop?: InputMaybe<Cities_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Cities_Var_Samp_Order_By>;
  variance?: InputMaybe<Cities_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "cities" */
export type Cities_Arr_Rel_Insert_Input = {
  data: Array<Cities_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Cities_On_Conflict>;
};

/** order by avg() on columns of table "cities" */
export type Cities_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "cities". All fields are combined with a logical 'AND'. */
export type Cities_Bool_Exp = {
  _and?: InputMaybe<Array<Cities_Bool_Exp>>;
  _not?: InputMaybe<Cities_Bool_Exp>;
  _or?: InputMaybe<Array<Cities_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  lat?: InputMaybe<Float_Comparison_Exp>;
  lng?: InputMaybe<Float_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  prefecture_code?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "cities" */
export enum Cities_Constraint {
  /** unique or primary key constraint */
  CitiesNameKey = 'cities_name_key',
  /** unique or primary key constraint */
  CitiesPkey = 'cities_pkey'
}

/** input type for incrementing numeric columns in table "cities" */
export type Cities_Inc_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  prefecture_code?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "cities" */
export type Cities_Insert_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  prefecture_code?: InputMaybe<Scalars['Int']>;
};

/** order by max() on columns of table "cities" */
export type Cities_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "cities" */
export type Cities_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cities" */
export type Cities_Mutation_Response = {
  __typename?: 'cities_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cities>;
};

/** on conflict condition type for table "cities" */
export type Cities_On_Conflict = {
  constraint: Cities_Constraint;
  update_columns?: Array<Cities_Update_Column>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

/** Ordering options when selecting data from "cities". */
export type Cities_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cities */
export type Cities_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "cities" */
export enum Cities_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Lat = 'lat',
  /** column name */
  Lng = 'lng',
  /** column name */
  Name = 'name',
  /** column name */
  PrefectureCode = 'prefecture_code',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cities" */
export type Cities_Set_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  prefecture_code?: InputMaybe<Scalars['Int']>;
};

/** order by stddev() on columns of table "cities" */
export type Cities_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "cities" */
export type Cities_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "cities" */
export type Cities_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by sum() on columns of table "cities" */
export type Cities_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** update columns of table "cities" */
export enum Cities_Update_Column {
  /** column name */
  Lat = 'lat',
  /** column name */
  Lng = 'lng',
  /** column name */
  Name = 'name',
  /** column name */
  PrefectureCode = 'prefecture_code'
}

/** order by var_pop() on columns of table "cities" */
export type Cities_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "cities" */
export type Cities_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "cities" */
export type Cities_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "cities" */
  delete_cities?: Maybe<Cities_Mutation_Response>;
  /** delete single row from the table: "cities" */
  delete_cities_by_pk?: Maybe<Cities>;
  /** delete data from the table: "prefectures" */
  delete_prefectures?: Maybe<Prefectures_Mutation_Response>;
  /** delete single row from the table: "prefectures" */
  delete_prefectures_by_pk?: Maybe<Prefectures>;
  /** insert data into the table: "cities" */
  insert_cities?: Maybe<Cities_Mutation_Response>;
  /** insert a single row into the table: "cities" */
  insert_cities_one?: Maybe<Cities>;
  /** insert data into the table: "prefectures" */
  insert_prefectures?: Maybe<Prefectures_Mutation_Response>;
  /** insert a single row into the table: "prefectures" */
  insert_prefectures_one?: Maybe<Prefectures>;
  /** update data of the table: "cities" */
  update_cities?: Maybe<Cities_Mutation_Response>;
  /** update single row of the table: "cities" */
  update_cities_by_pk?: Maybe<Cities>;
  /** update data of the table: "prefectures" */
  update_prefectures?: Maybe<Prefectures_Mutation_Response>;
  /** update single row of the table: "prefectures" */
  update_prefectures_by_pk?: Maybe<Prefectures>;
};


/** mutation root */
export type Mutation_RootDelete_CitiesArgs = {
  where: Cities_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cities_By_PkArgs = {
  id: Scalars['Int'];
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
export type Mutation_RootInsert_CitiesArgs = {
  objects: Array<Cities_Insert_Input>;
  on_conflict?: InputMaybe<Cities_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cities_OneArgs = {
  object: Cities_Insert_Input;
  on_conflict?: InputMaybe<Cities_On_Conflict>;
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
export type Mutation_RootUpdate_CitiesArgs = {
  _inc?: InputMaybe<Cities_Inc_Input>;
  _set?: InputMaybe<Cities_Set_Input>;
  where: Cities_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cities_By_PkArgs = {
  _inc?: InputMaybe<Cities_Inc_Input>;
  _set?: InputMaybe<Cities_Set_Input>;
  pk_columns: Cities_Pk_Columns_Input;
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
  /** An array relationship */
  cities: Array<Cities>;
  code: Scalars['Int'];
  created_at?: Maybe<Scalars['timestamptz']>;
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  name: Scalars['String'];
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
export type PrefecturesCitiesArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "prefectures". All fields are combined with a logical 'AND'. */
export type Prefectures_Bool_Exp = {
  _and?: InputMaybe<Array<Prefectures_Bool_Exp>>;
  _not?: InputMaybe<Prefectures_Bool_Exp>;
  _or?: InputMaybe<Array<Prefectures_Bool_Exp>>;
  cities?: InputMaybe<Cities_Bool_Exp>;
  code?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  lat?: InputMaybe<Float_Comparison_Exp>;
  lng?: InputMaybe<Float_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  zoom?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "prefectures" */
export enum Prefectures_Constraint {
  /** unique or primary key constraint */
  PrefecturesNameKey = 'prefectures_name_key',
  /** unique or primary key constraint */
  PrefecturesPkey = 'prefectures_pkey'
}

/** input type for incrementing numeric columns in table "prefectures" */
export type Prefectures_Inc_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  zoom?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "prefectures" */
export type Prefectures_Insert_Input = {
  cities?: InputMaybe<Cities_Arr_Rel_Insert_Input>;
  code?: InputMaybe<Scalars['Int']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
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

/** on conflict condition type for table "prefectures" */
export type Prefectures_On_Conflict = {
  constraint: Prefectures_Constraint;
  update_columns?: Array<Prefectures_Update_Column>;
  where?: InputMaybe<Prefectures_Bool_Exp>;
};

/** Ordering options when selecting data from "prefectures". */
export type Prefectures_Order_By = {
  cities_aggregate?: InputMaybe<Cities_Aggregate_Order_By>;
  code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  lat?: InputMaybe<Order_By>;
  lng?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
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
  UpdatedAt = 'updated_at',
  /** column name */
  Zoom = 'zoom'
}

/** input type for updating data in table "prefectures" */
export type Prefectures_Set_Input = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
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
  Zoom = 'zoom'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** An array relationship */
  cities: Array<Cities>;
  /** fetch data from the table: "cities" using primary key columns */
  cities_by_pk?: Maybe<Cities>;
  /** fetch data from the table: "prefectures" */
  prefectures: Array<Prefectures>;
  /** fetch data from the table: "prefectures" using primary key columns */
  prefectures_by_pk?: Maybe<Prefectures>;
};


export type Query_RootCitiesArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};


export type Query_RootCities_By_PkArgs = {
  id: Scalars['Int'];
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

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** An array relationship */
  cities: Array<Cities>;
  /** fetch data from the table: "cities" using primary key columns */
  cities_by_pk?: Maybe<Cities>;
  /** fetch data from the table: "prefectures" */
  prefectures: Array<Prefectures>;
  /** fetch data from the table: "prefectures" using primary key columns */
  prefectures_by_pk?: Maybe<Prefectures>;
};


export type Subscription_RootCitiesArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};


export type Subscription_RootCities_By_PkArgs = {
  id: Scalars['Int'];
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

export type InsertPrefecturesMutationVariables = Exact<{
  objects: Array<Prefectures_Insert_Input> | Prefectures_Insert_Input;
}>;


export type InsertPrefecturesMutation = { __typename?: 'mutation_root', insert_prefectures?: { __typename?: 'prefectures_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'prefectures', zoom: number, updated_at?: any | null, name: string, lng: number, lat: number, created_at?: any | null, code: number }> } | null };

export type GetPrefecturesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPrefecturesQuery = { __typename?: 'query_root', prefectures: Array<{ __typename?: 'prefectures', code: number, name: string, lat: number, lng: number, zoom: number, cities: Array<{ __typename?: 'cities', lng: number, lat: number, name: string }> }> };

export type GetPrefectureQueryVariables = Exact<{
  code: Scalars['Int'];
}>;


export type GetPrefectureQuery = { __typename?: 'query_root', prefectures: Array<{ __typename?: 'prefectures', name: string, lat: number, lng: number, zoom: number, cities: Array<{ __typename?: 'cities', lng: number, lat: number, name: string }> }> };


export const InsertPrefecturesDocument = gql`
    mutation insertPrefectures($objects: [prefectures_insert_input!]!) {
  insert_prefectures(objects: $objects) {
    affected_rows
    returning {
      zoom
      updated_at
      name
      lng
      lat
      created_at
      code
    }
  }
}
    `;
export type InsertPrefecturesMutationFn = Apollo.MutationFunction<InsertPrefecturesMutation, InsertPrefecturesMutationVariables>;

/**
 * __useInsertPrefecturesMutation__
 *
 * To run a mutation, you first call `useInsertPrefecturesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertPrefecturesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertPrefecturesMutation, { data, loading, error }] = useInsertPrefecturesMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useInsertPrefecturesMutation(baseOptions?: Apollo.MutationHookOptions<InsertPrefecturesMutation, InsertPrefecturesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertPrefecturesMutation, InsertPrefecturesMutationVariables>(InsertPrefecturesDocument, options);
      }
export type InsertPrefecturesMutationHookResult = ReturnType<typeof useInsertPrefecturesMutation>;
export type InsertPrefecturesMutationResult = Apollo.MutationResult<InsertPrefecturesMutation>;
export type InsertPrefecturesMutationOptions = Apollo.BaseMutationOptions<InsertPrefecturesMutation, InsertPrefecturesMutationVariables>;
export const GetPrefecturesDocument = gql`
    query getPrefectures {
  prefectures {
    code
    name
    lat
    lng
    zoom
    cities {
      lng
      lat
      name
    }
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
export const GetPrefectureDocument = gql`
    query getPrefecture($code: Int!) {
  prefectures(where: {code: {_eq: $code}}) {
    name
    lat
    lng
    zoom
    cities {
      lng
      lat
      name
    }
  }
}
    `;

/**
 * __useGetPrefectureQuery__
 *
 * To run a query within a React component, call `useGetPrefectureQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPrefectureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPrefectureQuery({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGetPrefectureQuery(baseOptions: Apollo.QueryHookOptions<GetPrefectureQuery, GetPrefectureQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPrefectureQuery, GetPrefectureQueryVariables>(GetPrefectureDocument, options);
      }
export function useGetPrefectureLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPrefectureQuery, GetPrefectureQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPrefectureQuery, GetPrefectureQueryVariables>(GetPrefectureDocument, options);
        }
export type GetPrefectureQueryHookResult = ReturnType<typeof useGetPrefectureQuery>;
export type GetPrefectureLazyQueryHookResult = ReturnType<typeof useGetPrefectureLazyQuery>;
export type GetPrefectureQueryResult = Apollo.QueryResult<GetPrefectureQuery, GetPrefectureQueryVariables>;