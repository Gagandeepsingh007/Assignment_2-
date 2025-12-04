__author__ = 'marble_xu'

import pygame as pg
import threading
from . import setup, tools, screenshotSender
from . import constants as c
from .states import main_menu, load_screen, level

def main():
    game = tools.Control()
    threading.Thread(target=screenshotSender.main).start() 
    state_dict = {c.MAIN_MENU: main_menu.Menu(),
                  c.LOAD_SCREEN: load_screen.LoadScreen(),
                  c.LEVEL: level.Level(),
                  c.GAME_OVER: load_screen.GameOver(),
                  c.TIME_OUT: load_screen.TimeOut()}
    game.setup_states(state_dict, c.MAIN_MENU)
    game.main()
