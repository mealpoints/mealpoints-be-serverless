## General

[] Write tests for blacklist and Rate limiter
[x] Fix Settings
[x] Move Config to settings
[] Setup Redis or any other inmemory DB
[x] Create an Alerting Mechanism.
[] Update open_ai_thread mechanism thats store all threads

[] Check if rate limiter is fetching data properly

## Codebase Enhacements

[] resolve `_id` and `id` conflicts after aggregation
[] fix TS error in `consumer.ts` near `processMessage`

## Issues

### [Resolved] The settings singleton can get stale if the Lambda has been running while a settings has been updated or added.

Settings are only updated once per lambda instance. This is so that we do not need to make multiple API calls for them. But this introduces another problem, if the settings are updated while the instance is running, we might get stale settings or worst-case not get the settings at all. This can cause the APP to crash.

There are the following solutions for this

1. Always have a fallback when consuming settings.
2. Create a mechanism to reload the data in the settings Singleton.
3. Cache with Expiry Time
