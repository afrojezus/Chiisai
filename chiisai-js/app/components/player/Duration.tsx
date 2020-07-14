// https://github.com/CookPete/react-player/blob/812462c50f1e2792aa8a93c4e73553cc59d21cd9/src/demo/Duration.js
import React from 'react';

function pad(string: number): string {
  return `0${string}`.slice(-2);
}

function format(seconds: number): string {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export default function Duration({
  className,
  seconds,
}: {
  className: string | undefined;
  seconds: number;
}) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  );
}
