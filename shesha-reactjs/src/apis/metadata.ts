import { useGet, UseGetProps } from '@/hooks/useGet';
import { IAjaxResponse, IAjaxResponseBase } from '@/interfaces/ajaxResponse';
import * as RestfulShesha from '@/utils/fetchers';

/**
 * Indicate the source of the entity/property metadata
 */
export type MetadataSourceType = 1 | 2;

export interface PropertyMetadataDto {
  cascadeCreate?: boolean;
  cascadeUpdate?: boolean;
  cascadeDeleteUnreferenced?: boolean;
  isVisible?: boolean;
  required?: boolean;
  readonly?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
  min?: number | null;
  max?: number | null;
  /**
   * Equivalent to Audited attribute on the property
   */
  audited?: boolean;
  /**
   * Validation RegularExpression
   */
  regExp?: string | null;
  /**
   * Validation message
   */
  validationMessage?: string | null;
  path?: string | null;
  label?: string | null;
  description?: string | null;
  dataType?: string | null;
  dataFormat?: string | null;
  entityType?: string | null;
  referenceListName?: string | null;
  referenceListModule?: string | null;
  orderIndex?: number;
  groupName?: string | null;
  /**
   * If true, indicates that current property is a framework-related (e.g. Abp.Domain.Entities.ISoftDelete.IsDeleted, Abp.Domain.Entities.Auditing.IHasModificationTime.LastModificationTime)
   */
  isFrameworkRelated?: boolean;
  /**
   * Child properties (applicable for complex objects)
   */
  properties?: PropertyMetadataDto[] | null;
  itemsType?: PropertyMetadataDto;
  source?: MetadataSourceType;
}

/**
 * API endpoint DTO
 */
export interface ApiEndpointDto {
  /**
   * Http verb (get/post/put etc)
   */
  httpVerb?: string | null;
  /**
   * Url
   */
  url?: string | null;
}

/**
 * DTO of the specification that can be applied on top of the entity query
 */
export interface SpecificationDto {
  /**
   * Name. Unique for all specifications in the application
   */
  name?: string | null;
  /**
   * Friendly name
   */
  friendlyName?: string | null;
  /**
   * Description
   */
  description?: string | null;
}

/**
 * Metadata DTO
 */
export interface MetadataDto {
  /**
   * Data type
   */
  dataType?: string | null;
  /**
   * Propeties
   */
  properties?: PropertyMetadataDto[] | null;
  /**
   * Specifications, applicable for entities
   */
  specifications?: SpecificationDto[] | null;
  /**
   * Default API endpoints.
   * key - operation name (create/read/update/delete etc.)
   * value - endpoint DTO (url and http verb)
   */
  apiEndpoints?: {
    [key: string]: ApiEndpointDto;
  } | null;
}

export type MetadataDtoAjaxResponse = IAjaxResponse<MetadataDto>;

export interface MetadataGetQueryParams {
  container?: string;
  /**
   * The requested API version
   */
  'api-version'?: string;
}

export type metadataGetProps = Omit<
  RestfulShesha.GetProps<MetadataDtoAjaxResponse, IAjaxResponseBase, MetadataGetQueryParams, void>,
  'queryParams'
>;
export const metadataGet = (queryParams: MetadataGetQueryParams, props: metadataGetProps) =>
  RestfulShesha.get<MetadataDtoAjaxResponse, IAjaxResponseBase, MetadataGetQueryParams, void>(
    `/api/services/app/Metadata/Get`,
    queryParams,
    props
  );

export type UseMetadataGetProps = Omit<UseGetProps<MetadataDtoAjaxResponse, MetadataGetQueryParams, void>, 'path'>;
export const useMetadataGet = (props: UseMetadataGetProps) =>
  useGet<MetadataDtoAjaxResponse, IAjaxResponseBase, MetadataGetQueryParams, void>(
    `/api/services/app/Metadata/Get`,
    props
  );
