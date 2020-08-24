#!/usr/bin/env /usr/bin/python3

from gpiozero import Button
from signal import pause
from os import system
from json import loads

CONFIG_PATH = 'my.config'

hostname = '127.0.0.1'
port = 8080
pass_key = 'thisIsSecret'
gpio_num = 17

try:
    with open(CONFIG_PATH) as f:
        obj = loads(f.read())

        if 'hostname' in obj:
            hostname = obj['hostname']
        if 'port' in obj:
            port = obj['port']
        if 'pass_key' in obj:
            pass_key = obj['pass_key']
        if 'gpio_num' in obj:
            gpio_num = obj['gpio_num']
except:
    pass

b = Button(gpio_num)
b.when_pressed = lambda : system("curl -d pass_key={} {}:{}".format(pass_key, hostname, port))

pause()