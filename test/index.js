import * as suites from './suites';
import { klona } from '../src/index';

suites.API(klona);

suites.Strings(klona);
suites.Booleans(klona);
suites.Numbers(klona);
suites.Nully(klona);

suites.Dates(klona);
suites.RegExps(klona);

suites.Objects(klona);
suites.Arrays(klona);

suites.Functions(klona);
suites.Pollutions(klona);
suites.Classes(klona);

suites.Maps(klona);
suites.Sets(klona);

suites.TypedArrays(klona);
suites.Blobs(klona);
