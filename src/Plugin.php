<?php

namespace Miaoxing\Rev;

use Miaoxing\Plugin\Service\Asset;

/**
 * @property Asset $asset
 */
class Plugin extends \Miaoxing\Plugin\BasePlugin
{
    public $name = '素材版本号';

    public $description = '将前端素材生成版本号';

    public function onScript()
    {
        if ($this->asset->isEnableRev()) {
            $this->view->display('@rev/rev/script.php');
        }
    }
}
