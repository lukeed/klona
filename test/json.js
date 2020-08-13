import * as suites from './suites';
import { klona } from '../src/json';

suites.API(klona);

suites.Strings(klona);
suites.Booleans(klona);
suites.Numbers(klona);
suites.Nully(klona);

suites.Objects(klona);
suites.Arrays(klona);

suites.Pollutions(klona);
